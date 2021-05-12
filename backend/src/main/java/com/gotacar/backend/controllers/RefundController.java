package com.gotacar.backend.controllers;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.paymentReturn.PaymentReturn;
import com.gotacar.backend.models.paymentReturn.PaymentReturnRepository;
import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.tripOrder.TripOrder;
import com.gotacar.backend.models.tripOrder.TripOrderRepository;
import com.stripe.Stripe;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class RefundController {

    @Autowired
    private TripOrderRepository tripOrderRepository;

    @Autowired
    private PaymentReturnRepository paymentReturnRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${STRIPE_API_KEY:sk_test_4eC39HqLyjWDarjtT1zdp7dc}")
    private String stripeApiKey;

    public void createRefundClientCancel(TripOrder tripOrder) {

        try {
            Stripe.apiKey = stripeApiKey;
            String payment = tripOrder.getPaymentIntent();
            Long amount = 0L;
            var dateStartZone = ZonedDateTime.now();
            dateStartZone = dateStartZone.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
            var now = dateStartZone.toLocalDateTime();
            if (now.isBefore(tripOrder.getTrip().getCancelationDateLimit())) {
                amount = (long) (tripOrder.getPrice() * (90.0f / 100.0f));
                var refund = Refund
                        .create(RefundCreateParams.builder().setAmount(amount).setPaymentIntent(payment).build());

                var user = tripOrder.getUser();

                tripOrder.setStatus("REFUNDED");
                tripOrderRepository.save(tripOrder);
                createPaymentReturn(refund, user);
            } else {
                // TODO 60% al conductor y 40% GotACar
                tripOrder.setStatus("CANT_REFUND");
                tripOrderRepository.save(tripOrder);
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }

    }

    public void createRefundDriverRejection(TripOrder tripOrder) {

        try {
            Stripe.apiKey = stripeApiKey;

            String payment = tripOrder.getPaymentIntent();
            var dateStartZone = ZonedDateTime.now();

            dateStartZone = dateStartZone.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
            var now = dateStartZone.toLocalDateTime();
            if (now.isBefore(tripOrder.getTrip().getCancelationDateLimit())) {

                var refund = Refund.create(RefundCreateParams.builder().setPaymentIntent(payment).build());

                var user = tripOrder.getUser();

                tripOrder.setStatus("REFUNDED");
                tripOrderRepository.save(tripOrder);
                createPaymentReturn(refund, user);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La fecha de cancelación ha expirado");
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }

    }

    public void createRefundDriverCancelTrip(Trip trip) {

        try {
            Stripe.apiKey = stripeApiKey;
            var dateStartZone = ZonedDateTime.now();
            dateStartZone = dateStartZone.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
            var now = dateStartZone.toLocalDateTime();
            List<TripOrder> tripOrders = tripOrderRepository.findByTripAndStatus(trip, "PAID");

            for (TripOrder tripOrder : tripOrders) {
                String payment = tripOrder.getPaymentIntent();
                var refund = Refund.create(RefundCreateParams.builder().setPaymentIntent(payment).build());
                var user = tripOrder.getUser();
                tripOrder.setStatus("REFUNDED");
                tripOrderRepository.save(tripOrder);
                createPaymentReturn(refund, user);
            }

            if (now.isAfter(trip.getCancelationDateLimit())) {
                LocalDateTime ban = now.plusWeeks(2);
                var user = trip.getDriver();
                user.setBannedUntil(ban);
                userRepository.save(user);
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }

    }

    public void createPaymentReturn(Refund refund, User user) {
        Integer amount = refund.getAmount().intValue();
        var paymentReturn = new PaymentReturn(user, amount);
        paymentReturnRepository.save(paymentReturn);
    }

}

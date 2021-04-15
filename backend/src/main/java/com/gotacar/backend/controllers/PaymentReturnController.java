package com.gotacar.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.gotacar.backend.models.paymentReturn.PaymentReturnRepository;
import com.gotacar.backend.models.paymentReturn.PaymentReturn;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET})
public class PaymentReturnController {

@Autowired
PaymentReturnRepository paymentReturnRepository;

@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/paymentReturn/listPending")
	public List<PaymentReturn> listPendingPaymentReturns() {
		try {
			return paymentReturnRepository.findByStatus("PENDING");
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}
	}

}
package com.gotacar.backend.models.tripOrder;

import java.util.List;

public interface TripOrderRepositoryCustom {

    TripOrder searchProcessingTripOrderByTripAndUser(String tripId, String userId);

    List<TripOrder> userHasMadeTrip(String userId, String tripId);

}

package com.gotacar.backend.models.TripOrder;

public interface TripOrderRepositoryCustom {

    TripOrder searchTripOrderByTripAndUser(String tripId, String userId);

}

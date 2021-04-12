package com.gotacar.backend.models.tripOrder;

import java.util.List;

import org.bson.types.ObjectId;

public interface TripOrderRepositoryCustom {

    TripOrder searchProcessingTripOrderByTripAndUser(String tripId, String userId);

    List<TripOrder> userHasMadeTrip(ObjectId userId, ObjectId tripId);

}

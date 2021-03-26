package com.gotacar.backend.models.TripOrder;

import java.util.List;

import org.bson.types.ObjectId;

public interface TripOrderRepositoryCustom {

    List<TripOrder> userHasMadeTrip(ObjectId userId, ObjectId tripId);
}

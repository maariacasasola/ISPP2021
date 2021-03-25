package com.gotacar.backend.controllers;

import java.util.ArrayList;
import java.util.List;

import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class TripOrderController {

    @Autowired
    private TripOrderRepository tripOrderRepository;

    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @RequestMapping("/list_triporders")
    public List<TripOrder> listHiredTrips(@RequestParam("uid") String uid) {
        List<TripOrder> lista = new ArrayList<>();
        try {
            lista = tripOrderRepository.findByUserUid(uid);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return lista;
    }
    
}

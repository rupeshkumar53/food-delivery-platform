//package com.fooddelivery.admin_service.Service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//@Transactional
//public class DeliveryService {
//	// All restaurants
//	// All partners
//	public List<DeliveryPartnerResponse> 
//	        getAllPartners() {
//	    return partnerRepository.findAll()
//	        .stream()
//	        .map(this::toResponse)
//	        .collect(java.util.stream
//	            .Collectors.toList());
//	}
//
//	// Delete partner
//	public void deletePartner(Long id) {
//	    partnerRepository.deleteById(id);
//	}
//}
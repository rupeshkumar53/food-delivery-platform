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
//public class OrderService {
//	// All orders
//	public List<OrderResponse> getAllOrders() {
//	    return orderRepository.findAll()
//	        .stream()
//	        .map(this::toResponse)
//	        .collect(java.util.stream
//	            .Collectors.toList());
//	}
//
//	// Delete order
//	public void deleteOrder(Long id) {
//	    orderRepository.deleteById(id);
//	}
//}
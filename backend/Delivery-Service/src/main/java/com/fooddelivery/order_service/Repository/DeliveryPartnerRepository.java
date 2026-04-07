package com.fooddelivery.order_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.order_service.Model.DeliveryPartner;

public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {

	List<DeliveryPartner> findByUserId(Long userId);

	// Available partners
	List<DeliveryPartner> findByIsAvailable(boolean isAvailable);
}

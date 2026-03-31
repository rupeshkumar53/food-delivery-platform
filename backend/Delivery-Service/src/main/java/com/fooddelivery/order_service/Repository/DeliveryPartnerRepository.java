package com.fooddelivery.order_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.order_service.Model.DeliveryPartner;
import java.util.List;
import java.util.Optional;

public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {

	Optional<DeliveryPartner> findByUserId(Long userId);

	List<DeliveryPartner> findByIsAvailable(boolean isAvailable);
}

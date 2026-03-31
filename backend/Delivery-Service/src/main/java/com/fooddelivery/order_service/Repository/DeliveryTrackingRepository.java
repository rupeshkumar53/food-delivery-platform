package com.fooddelivery.order_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.order_service.Model.DeliveryTracking;

import java.util.List;
import java.util.Optional;

public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, Long> {

	List<DeliveryTracking> findByOrderId(Long orderId);

	Optional<DeliveryTracking> findTopByOrderIdOrderByRecordedAtDesc(Long orderId);
}

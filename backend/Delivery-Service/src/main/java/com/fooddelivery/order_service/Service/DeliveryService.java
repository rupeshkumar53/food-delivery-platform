package com.fooddelivery.order_service.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.order_service.DTO.DeliveryPartnerResponse;
import com.fooddelivery.order_service.DTO.LocationUpdateRequest;
import com.fooddelivery.order_service.Model.DeliveryPartner;
import com.fooddelivery.order_service.Model.DeliveryTracking;
import com.fooddelivery.order_service.Repository.DeliveryPartnerRepository;
import com.fooddelivery.order_service.Repository.DeliveryTrackingRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

	@Autowired
	private DeliveryPartnerRepository partnerRepository;

	@Autowired
	private DeliveryTrackingRepository trackingRepository;

	// Partner register karo
	public DeliveryPartnerResponse registerPartner(Long userId, String name, String phone, String vehicleType) {

		DeliveryPartner partner = new DeliveryPartner();
		partner.setUserId(userId);
		partner.setName(name);
		partner.setPhone(phone);
		partner.setVehicleType(DeliveryPartner.VehicleType.valueOf(vehicleType));
		partner.setAvailable(true);

		return toResponse(partnerRepository.save(partner));
	}

	// Available partners
	public List<DeliveryPartnerResponse> getAvailablePartners() {
		return partnerRepository.findByIsAvailable(true).stream().map(this::toResponse).collect(Collectors.toList());
	}

	// Location update karo
	public DeliveryPartnerResponse updateLocation(Long userId, LocationUpdateRequest request) {

		DeliveryPartner partner = partnerRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Partner not found!"));

		partner.setCurrentLat(request.getLat());
		partner.setCurrentLng(request.getLng());

		// Tracking history save karo
		DeliveryTracking tracking = new DeliveryTracking();
		tracking.setPartnerId(partner.getId());
		tracking.setLat(request.getLat());
		tracking.setLng(request.getLng());
		trackingRepository.save(tracking);

		return toResponse(partnerRepository.save(partner));
	}

	// Order accept karo
	public DeliveryPartnerResponse acceptOrder(Long userId, Long orderId) {

		DeliveryPartner partner = partnerRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Partner not found!"));

		// Partner busy ho gaya
		partner.setAvailable(false);

		// Tracking entry banao
		DeliveryTracking tracking = new DeliveryTracking();
		tracking.setPartnerId(partner.getId());
		tracking.setOrderId(orderId);
		tracking.setLat(partner.getCurrentLat());
		tracking.setLng(partner.getCurrentLng());
		trackingRepository.save(tracking);

		return toResponse(partnerRepository.save(partner));
	}

	// Delivery complete karo
	public DeliveryPartnerResponse completeDelivery(Long userId) {

		DeliveryPartner partner = partnerRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Partner not found!"));

		// Partner available ho gaya
		partner.setAvailable(true);
		partner.setTotalDeliveries(partner.getTotalDeliveries() + 1);

		return toResponse(partnerRepository.save(partner));
	}

	// Order ki last location
	public DeliveryTracking getLastLocation(Long orderId) {
		return trackingRepository.findTopByOrderIdOrderByRecordedAtDesc(orderId)
				.orElseThrow(() -> new RuntimeException("Tracking not found!"));
	}

	// Entity → DTO
	private DeliveryPartnerResponse toResponse(DeliveryPartner p) {
		DeliveryPartnerResponse res = new DeliveryPartnerResponse();
		res.setId(p.getId());
		res.setUserId(p.getUserId());
		res.setName(p.getName());
		res.setPhone(p.getPhone());
		res.setVehicleType(p.getVehicleType().name());
		res.setCurrentLat(p.getCurrentLat());
		res.setCurrentLng(p.getCurrentLng());
		res.setAvailable(p.isAvailable());
		res.setRating(p.getRating());
		res.setTotalDeliveries(p.getTotalDeliveries());
		return res;
	}
}

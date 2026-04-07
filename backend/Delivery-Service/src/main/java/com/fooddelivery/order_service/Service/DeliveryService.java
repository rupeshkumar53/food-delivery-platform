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

    // ✅ Central helper — userId se latest partner
    private DeliveryPartner getPartnerByUser(
            Long userId) {
        List<DeliveryPartner> partners =
            partnerRepository.findByUserId(userId);

        if (partners == null || partners.isEmpty()) {
            throw new RuntimeException(
                "Partner not found for userId: "
                + userId);
        }

        // ✅ Latest partner lo (highest id)
        return partners.stream()
            .max(java.util.Comparator.comparing(
                DeliveryPartner::getId))
            .orElseThrow(() ->
                new RuntimeException(
                    "Partner not found!"));
    }

    // Register karo
    public DeliveryPartnerResponse registerPartner(
            Long userId, String name,
            String phone, String vehicleType,
            Double currentLat, Double currentLng) {

        // ✅ Already exists? Update karo
        List<DeliveryPartner> existing =
            partnerRepository.findByUserId(userId);

        DeliveryPartner partner;
        if (!existing.isEmpty()) {
            partner = existing.stream()
                .max(java.util.Comparator.comparing(
                    DeliveryPartner::getId))
                .get();
        } else {
            partner = new DeliveryPartner();
            partner.setUserId(userId);
        }

        partner.setName(name);
        partner.setPhone(phone);
        partner.setCurrentLat(currentLat);
        partner.setCurrentLng(currentLng);
        partner.setVehicleType(
            DeliveryPartner.VehicleType
                .valueOf(vehicleType));
        partner.setAvailable(true);

        return toResponse(
            partnerRepository.save(partner));
    }

    // Available partners
    public List<DeliveryPartnerResponse>
            getAvailablePartners() {
        return partnerRepository
            .findByIsAvailable(true)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // ✅ Location update — List use karo
    public DeliveryPartnerResponse updateLocation(
            Long userId,
            LocationUpdateRequest request) {

        // ✅ getPartnerByUser helper use karo
        DeliveryPartner partner =
            getPartnerByUser(userId);

        partner.setCurrentLat(request.getLat());
        partner.setCurrentLng(request.getLng());

        DeliveryTracking tracking =
            new DeliveryTracking();
        tracking.setPartnerId(partner.getId());
        tracking.setLat(request.getLat());
        tracking.setLng(request.getLng());
        trackingRepository.save(tracking);

        return toResponse(
            partnerRepository.save(partner));
    }

    // ✅ Order accept — List use karo
    public DeliveryPartnerResponse acceptOrder(
            Long userId, Long orderId) {

        DeliveryPartner partner =
            getPartnerByUser(userId);

        partner.setAvailable(false);

        DeliveryTracking tracking =
            new DeliveryTracking();
        tracking.setPartnerId(partner.getId());
        tracking.setOrderId(orderId);
        tracking.setLat(partner.getCurrentLat());
        tracking.setLng(partner.getCurrentLng());
        trackingRepository.save(tracking);

        return toResponse(
            partnerRepository.save(partner));
    }

    // ✅ Delivery complete — List use karo
    public DeliveryPartnerResponse completeDelivery(
            Long userId) {

        DeliveryPartner partner =
            getPartnerByUser(userId);

        partner.setAvailable(true);
        partner.setTotalDeliveries(
            partner.getTotalDeliveries() + 1);

        return toResponse(
            partnerRepository.save(partner));
    }

    // Last location
    public DeliveryTracking getLastLocation(
            Long orderId) {
        return trackingRepository
            .findTopByOrderIdOrderByRecordedAtDesc(
                orderId)
            .orElseThrow(() ->
                new RuntimeException(
                    "Tracking not found!"));
    }

    // Partner by ID
    public DeliveryPartnerResponse getPartnerById(
            Long partnerId) {
        DeliveryPartner partner = partnerRepository
            .findById(partnerId)
            .orElseThrow(() ->
                new RuntimeException(
                    "Partner not found!"));
        return toResponse(partner);
    }

    // ✅ Partner by userId — List use karo
    public DeliveryPartnerResponse getPartnerByUserId(
            Long userId) {
        DeliveryPartner partner =
            getPartnerByUser(userId);
        System.out.println(partner.getName());
        System.out.println(partner.getPhone());
        System.out.println(partner.getRating());
        return toResponse(partner);
    }

    // Nearest available partner
    public DeliveryPartnerResponse findNearestPartner(
            Double orderLat, Double orderLng) {

        List<DeliveryPartner> partners =
            partnerRepository.findByIsAvailable(true);

        if (partners.isEmpty()) {
            throw new RuntimeException(
                "No delivery partners available!");
        }

        DeliveryPartner nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (DeliveryPartner partner : partners) {
            if (partner.getCurrentLat() == null ||
                partner.getCurrentLng() == null) {
                continue;
            }
            double distance = calculateDistance(
                orderLat, orderLng,
                partner.getCurrentLat(),
                partner.getCurrentLng());
            if (distance < minDistance) {
                minDistance = distance;
                nearest = partner;
            }
        }

        if (nearest == null) {
            nearest = partners.get(0);
        }

        nearest.setAvailable(false);
        partnerRepository.save(nearest);
        return toResponse(nearest);
    }

    // All partners (admin)
    public List<DeliveryPartnerResponse>
            getAllPartners() {
        return partnerRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // Delete partner (admin)
    public void deletePartner(Long id) {
        System.out.println("Deleting partner: " + id);
        partnerRepository.deleteById(id);
    }

    // Haversine formula
    private double calculateDistance(
            double lat1, double lng1,
            double lat2, double lng2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a =
            Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
            Math.cos(Math.toRadians(lat1)) *
            Math.cos(Math.toRadians(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        double c = 2 * Math.atan2(
            Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Entity → DTO
    private DeliveryPartnerResponse toResponse(
            DeliveryPartner p) {
        DeliveryPartnerResponse res =
            new DeliveryPartnerResponse();
        res.setId(p.getId());
        res.setUserId(p.getUserId());
        res.setName(p.getName());
        res.setPhone(p.getPhone());
        res.setVehicleType(
            p.getVehicleType().name());
        res.setCurrentLat(p.getCurrentLat());
        res.setCurrentLng(p.getCurrentLng());
        res.setAvailable(p.isAvailable());
        res.setRating(p.getRating());
        res.setTotalDeliveries(
            p.getTotalDeliveries());
        return res;
    }
}
package com.fooddelivery.admin_service.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fooddelivery.admin_service.DTO.*;
import com.fooddelivery.admin_service.Model.AdminLog;
import com.fooddelivery.admin_service.Repository.AdminLogRepository;
import com.fooddelivery.admin_service.Security.ServiceUrlConfig;

import java.util.*;

@Service
public class AdminService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ServiceUrlConfig config;

    @Autowired
    private AdminLogRepository logRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // USERS
    public List<UserDTO> getAllUsers() {
        try {
            ResponseEntity<List<UserDTO>> response = restTemplate.exchange(
                    config.authServiceUrl + "/api/auth/all-users",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<UserDTO>>() {}
            );
            return response.getBody() != null ? response.getBody() : new ArrayList<>();
        } catch (Exception e) {
            System.out.println("getAllUsers error: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public void deleteUser(Long id, String adminEmail) {
        try {
            restTemplate.delete(config.authServiceUrl + "/api/auth/users/" + id);
            saveLog("DELETE_USER", "USER", id, adminEmail, "User deleted by admin");
        } catch (Exception e) {
            throw new RuntimeException("Could not delete user: " + e.getMessage());
        }
    }

    public UserDTO updateUserRole(Long id, String newRole, String adminEmail) {
        try {
            RoleUpdateRequest req = new RoleUpdateRequest();
            req.setRole(newRole);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<RoleUpdateRequest> entity = new HttpEntity<>(req, headers);

            ResponseEntity<UserDTO> response = restTemplate.exchange(
                    config.authServiceUrl + "/api/auth/users/" + id + "/role",
                    HttpMethod.PUT,
                    entity,
                    UserDTO.class
            );

            saveLog("UPDATE_ROLE", "USER", id, adminEmail, "Role updated to " + newRole);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Could not update role: " + e.getMessage());
        }
    }

    // RESTAURANTS
    public List<RestaurantDTO> getAllRestaurants() {
        try {
            ResponseEntity<List<RestaurantDTO>> res = restTemplate.exchange(
                    config.restaurantServiceUrl + "/api/restaurants/all",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<RestaurantDTO>>() {}
            );
            return res.getBody() != null ? res.getBody() : new ArrayList<>();
        } catch (Exception e) {
            try {
                ResponseEntity<List<RestaurantDTO>> r2 = restTemplate.exchange(
                        config.restaurantServiceUrl + "/api/restaurants?city=all",
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<RestaurantDTO>>() {}
                );
                return r2.getBody() != null ? r2.getBody() : new ArrayList<>();
            } catch (Exception ex) {
                return new ArrayList<>();
            }
        }
    }

    public void deleteRestaurant(Long id, String adminEmail) {
        try {
            restTemplate.delete(config.restaurantServiceUrl + "/api/restaurants/" + id);
            saveLog("DELETE_RESTAURANT", "RESTAURANT", id, adminEmail, "Restaurant deleted by admin");
        } catch (Exception e) {
            throw new RuntimeException("Could not delete restaurant: " + e.getMessage());
        }
    }

    public RestaurantDTO toggleRestaurant(Long id, String adminEmail) {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(new HttpHeaders());

            ResponseEntity<RestaurantDTO> response = restTemplate.exchange(
                    config.restaurantServiceUrl + "/api/restaurants/" + id + "/toggle",
                    HttpMethod.PUT,
                    entity,
                    RestaurantDTO.class
            );

            saveLog("TOGGLE_RESTAURANT", "RESTAURANT", id, adminEmail, "Restaurant toggled by admin");
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Could not toggle restaurant: " + e.getMessage());
        }
    }

    // DELIVERY PARTNERS
    public List<DeliveryPartnerDTO> getAllDeliveryPartners() {
        try {
            ResponseEntity<List<DeliveryPartnerDTO>> response = restTemplate.exchange(
                    config.deliveryServiceUrl + "/api/delivery/all-partners",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<DeliveryPartnerDTO>>() {}
            );
            return response.getBody() != null ? response.getBody() : new ArrayList<>();
        } catch (Exception e) {
            System.out.println("getPartners error: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public void deleteDeliveryPartner(Long id, String adminEmail, String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            restTemplate.exchange(
                    config.deliveryServiceUrl + "/api/delivery/partners/" + id,
                    HttpMethod.DELETE,
                    entity,
                    String.class
            );

            saveLog("DELETE_PARTNER", "DELIVERY_PARTNER", id, adminEmail, "Partner deleted by admin");

        } catch (Exception e) {
            throw new RuntimeException("Could not delete partner: " + e.getMessage());
        }
    }

    public DeliveryPartnerDTO togglePartner(Long id, String adminEmail) {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(new HttpHeaders());

            ResponseEntity<DeliveryPartnerDTO> response = restTemplate.exchange(
                    config.deliveryServiceUrl + "/api/delivery/toggle/" + id,
                    HttpMethod.PUT,
                    entity,
                    DeliveryPartnerDTO.class
            );

            saveLog("TOGGLE_PARTNER", "DELIVERY_PARTNER", id, adminEmail, "Partner toggled by admin");
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Could not toggle partner: " + e.getMessage());
        }
    }

    // ORDERS
    public List<OrderDTO> getAllOrders() {
        try {
            ResponseEntity<List<OrderDTO>> response = restTemplate.exchange(
                    config.orderServiceUrl + "/api/orders/all",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<OrderDTO>>() {}
            );
            return response.getBody() != null ? response.getBody() : new ArrayList<>();
        } catch (Exception e) {
            System.out.println("getAllOrders error: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public void deleteOrder(Long id, String adminEmail) {
        try {
            restTemplate.delete(config.orderServiceUrl + "/api/orders/" + id);
            saveLog("DELETE_ORDER", "ORDER", id, adminEmail, "Order deleted by admin");
        } catch (Exception e) {
            throw new RuntimeException("Could not delete order: " + e.getMessage());
        }
    }

    // STATS
    public AdminStatsDTO getStats() {
        List<UserDTO> users = getAllUsers();
        List<RestaurantDTO> restaurants = getAllRestaurants();
        List<DeliveryPartnerDTO> partners = getAllDeliveryPartners();
        List<OrderDTO> orders = getAllOrders();

        AdminStatsDTO stats = new AdminStatsDTO();
        stats.setTotalUsers(users.size());
        stats.setTotalRestaurants(restaurants.size());
        stats.setTotalDeliveryPartners(partners.size());
        stats.setTotalOrders(orders.size());

        long activeOrders = orders.stream()
                .filter(o -> o.getStatus() != null &&
                        (o.getStatus().equals("PLACED") ||
                                o.getStatus().equals("CONFIRMED") ||
                                o.getStatus().equals("PREPARING") ||
                                o.getStatus().equals("PICKED_UP")))
                .count();
        stats.setActiveOrders((int) activeOrders);

        stats.setOpenRestaurants((int) restaurants.stream().filter(RestaurantDTO::isOpen).count());
        stats.setAvailablePartners((int) partners.stream().filter(DeliveryPartnerDTO::isAvailable).count());

        double revenue = orders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()))
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0)
                .sum();
        stats.setTotalRevenue(revenue);

        return stats;
    }

    // LOGS
    public List<AdminLog> getAllLogs() {
        return logRepository.findAllByOrderByCreatedAtDesc();
    }

    private void saveLog(String action, String targetType, Long targetId, String adminEmail, String details) {
        AdminLog log = new AdminLog();
        log.setAction(action);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setPerformedBy(adminEmail);
        log.setDetails(details);
        logRepository.save(log);
    }
}

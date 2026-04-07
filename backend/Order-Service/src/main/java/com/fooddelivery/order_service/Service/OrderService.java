package com.fooddelivery.order_service.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fooddelivery.order_service.DTO.DeliveryPartnerDTO;
import com.fooddelivery.order_service.DTO.OrderItemRequest;
import com.fooddelivery.order_service.DTO.OrderRequest;
import com.fooddelivery.order_service.DTO.OrderResponse;
import com.fooddelivery.order_service.DTO.RestaurantDTO; 
import com.fooddelivery.order_service.Model.Order;
import com.fooddelivery.order_service.Model.Order.OrderStatus;
import com.fooddelivery.order_service.Model.OrderItem;
import com.fooddelivery.order_service.Repository.OrderRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    private RestTemplate restTemplate = new RestTemplate();

    // ✅ Order place karo
    public OrderResponse placeOrder(
            OrderRequest request, Long customerId) {

        double total = request.getItems()
            .stream()
            .mapToDouble(item ->
                item.getUnitPrice() * item.getQuantity())
            .sum();

        Order order = new Order();
        order.setCustomerId(customerId);
        order.setRestaurantId(request.getRestaurantId());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryLat(request.getDeliveryLat());
        order.setDeliveryLng(request.getDeliveryLng());
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.PLACED);

        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemRequest itemReq : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setMenuItemId(itemReq.getMenuItemId());
            item.setItemName(itemReq.getItemName());
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(itemReq.getUnitPrice());
            item.setOrder(order);
            orderItems.add(item);
        }
        order.setItems(orderItems);

        // ✅ Nearest partner assign karo
        try {
            String deliveryUrl =
                "http://localhost:9095/api/delivery/nearest"
                + "?lat=" + request.getDeliveryLat()
                + "&lng=" + request.getDeliveryLng();

            DeliveryPartnerDTO partner =
                restTemplate.getForObject(
                    deliveryUrl, DeliveryPartnerDTO.class);

            if (partner != null) {
                order.setDeliveryPartnerId(partner.getId());
                System.out.println(
                    "✅ Partner Assigned: " + partner.getName()
                    + " (ID: " + partner.getId() + ")");
            }
        } catch (Exception e) {
            System.out.println(
                "⚠️ No partner available: " + e.getMessage());
        }

        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    // ✅ Order by ID
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository
            .findById(orderId)
            .orElseThrow(() ->
                new RuntimeException("Order not found!"));
        return toResponse(order);
    }

    // ✅ Customer ke orders
    public List<OrderResponse> getMyOrders(Long customerId) {
        return orderRepository
            .findByCustomerIdOrderByPlacedAtDesc(customerId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // ✅ Cancel order
    public OrderResponse cancelOrder(Long orderId, Long customerId) {
        Order order = orderRepository
            .findById(orderId)
            .orElseThrow(() ->
                new RuntimeException("Order not found!"));

        if (!order.getStatus().equals(OrderStatus.PLACED)) {
            throw new RuntimeException(
                "Order cannot be cancelled now!");
        }
        if (!order.getCustomerId().equals(customerId)) {
            throw new RuntimeException("Not authorized!");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return toResponse(orderRepository.save(order));
    }

    // ✅ Status update
    public OrderResponse updateStatus(Long orderId, String status) {
        Order order = orderRepository
            .findById(orderId)
            .orElseThrow(() ->
                new RuntimeException("Order not found!"));

        order.setStatus(OrderStatus.valueOf(status));
        return toResponse(orderRepository.save(order));
    }

    // ✅ FIX — Restaurant userId se orders
    // Pehle RestaurantDTO use karo (OrderResponse nahi!)
    public List<OrderResponse> getByRestaurantUserId(Long userId) {
        try {
            String url =
                "http://localhost:9093/api/restaurants/owner/" + userId;

            System.out.println("🔍 Calling restaurant service: " + url);

            // ✅ RestaurantDTO[] use karo — OrderResponse nahi
            RestaurantDTO[] restaurants =
                restTemplate.getForObject(url, RestaurantDTO[].class);

            System.out.println("🔍 Restaurants found: " +
                (restaurants != null ? restaurants.length : 0));

            if (restaurants != null && restaurants.length > 0) {
                Long restaurantId = restaurants[0].getId();
                System.out.println("✅ Restaurant ID: " + restaurantId);

                List<Order> orders = orderRepository
                    .findByRestaurantId(restaurantId);

                System.out.println("✅ Orders for restaurant: " + orders.size());

                return orders.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            } else {
                System.out.println("❌ No restaurant found for userId: " + userId);
            }
        } catch (Exception e) {
            System.out.println(
                "❌ Restaurant fetch error: " + e.getMessage());
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    // ✅ FIX — Delivery partner ke orders
    public List<OrderResponse> getByDeliveryPartnerId(Long userId) {
        System.out.println("🔍 Finding orders for userId: " + userId);

        try {
            String url =
                "http://localhost:9095/api/delivery/partner-by-user/" + userId;

            System.out.println("🔍 Calling: " + url);

            // ✅ Sirf ek baar call karo
            DeliveryPartnerDTO partner =
                restTemplate.getForObject(url, DeliveryPartnerDTO.class);

            if (partner != null) {
                System.out.println("✅ Partner ID: " + partner.getId());

                List<Order> orders = orderRepository
                    .findByDeliveryPartnerId(partner.getId());

                System.out.println("✅ Orders found: " + orders.size());

                return orders.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
            } else {
                System.out.println("❌ Partner NULL for userId: " + userId);
            }
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    // ✅ Entity → DTO
    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomerId());
        response.setRestaurantId(order.getRestaurantId());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setPlacedAt(order.getPlacedAt());
        response.setDeliveryPartnerId(order.getDeliveryPartnerId());

        if (order.getItems() != null) {
            List<OrderItemRequest> itemList = new ArrayList<>();
            for (OrderItem item : order.getItems()) {
                OrderItemRequest i = new OrderItemRequest();
                i.setMenuItemId(item.getMenuItemId());
                i.setItemName(item.getItemName());
                i.setQuantity(item.getQuantity());
                i.setUnitPrice(item.getUnitPrice());
                itemList.add(i);
            }
            response.setItems(itemList);
        }

        return response;
    }

    // ✅ All orders — Admin
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // ✅ Delete order — Admin
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
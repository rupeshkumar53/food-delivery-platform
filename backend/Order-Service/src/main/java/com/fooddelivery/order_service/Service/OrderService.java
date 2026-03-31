package com.fooddelivery.order_service.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.order_service.DTO.OrderItemRequest;
import com.fooddelivery.order_service.DTO.OrderRequest;
import com.fooddelivery.order_service.DTO.OrderResponse;
import com.fooddelivery.order_service.Model.Order;
import com.fooddelivery.order_service.Model.Order.OrderStatus;
import com.fooddelivery.order_service.Model.OrderItem;
import com.fooddelivery.order_service.Repository.OrderRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Order place karo
    public OrderResponse placeOrder(
            OrderRequest request, Long customerId) {

        // Total amount calculate karo
        double total = request.getItems()
            .stream()
            .mapToDouble(item ->
                item.getUnitPrice() * item.getQuantity())
            .sum();

        // Order banao
        Order order = new Order();
        order.setCustomerId(customerId);
        order.setRestaurantId(request.getRestaurantId());
        order.setDeliveryAddress(
            request.getDeliveryAddress());
        order.setDeliveryLat(request.getDeliveryLat());
        order.setDeliveryLng(request.getDeliveryLng());
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.PLACED);

        // Order items banao
        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemRequest itemReq : 
                request.getItems()) {
            OrderItem item = new OrderItem();
            item.setMenuItemId(itemReq.getMenuItemId());
            item.setItemName(itemReq.getItemName());
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(itemReq.getUnitPrice());
            item.setOrder(order);
            orderItems.add(item);
        }

        order.setItems(orderItems);
        Order saved = orderRepository.save(order);

        return toResponse(saved);
    }

    // Order status dekho
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository
            .findById(orderId)
            .orElseThrow(() ->
                new RuntimeException("Order not found!"));
        return toResponse(order);
    }

    // Customer ke saare orders
    public List<OrderResponse> getMyOrders(
            Long customerId) {
        return orderRepository
            .findByCustomerIdOrderByPlacedAtDesc(
                customerId)
            .stream()
            .map(this::toResponse)
            .collect(java.util.stream.Collectors.toList());
    }

    // Order cancel karo
    public OrderResponse cancelOrder(
            Long orderId, Long customerId) {
        Order order = orderRepository
            .findById(orderId)
            .orElseThrow(() ->
                new RuntimeException("Order not found!"));

        // Sirf PLACED status pe cancel ho sakta hai
        if (!order.getStatus()
                .equals(OrderStatus.PLACED)) {
            throw new RuntimeException(
                "Order cannot be cancelled now!");
        }

        // Sirf apna order cancel kar sakta hai
        if (!order.getCustomerId().equals(customerId)) {
            throw new RuntimeException(
                "Not authorized!");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return toResponse(orderRepository.save(order));
    }

    // Status update karo (Restaurant/Delivery)
    public OrderResponse updateStatus(
            Long orderId, String status) {
        Order order = orderRepository
            .findById(orderId)
            .orElseThrow(() ->
                new RuntimeException("Order not found!"));

        order.setStatus(OrderStatus.valueOf(status));
        return toResponse(orderRepository.save(order));
    }

    // Entity → DTO
    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomerId());
        response.setRestaurantId(order.getRestaurantId());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());
        response.setDeliveryAddress(
            order.getDeliveryAddress());
        response.setPlacedAt(order.getPlacedAt());

        // ✅ Yeh add karo — items set karo
        if (order.getItems() != null) {
            List<OrderItemRequest> itemList = 
                new ArrayList<>();
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
}
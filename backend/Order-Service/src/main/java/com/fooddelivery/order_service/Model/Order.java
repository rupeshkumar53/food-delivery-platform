package com.fooddelivery.order_service.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long customerId;
	private Long restaurantId;
	private Long deliveryPartnerId;

	@Enumerated(EnumType.STRING)
	private OrderStatus status;

	private Double totalAmount;
	private String deliveryAddress;
	private Double deliveryLat;
	private Double deliveryLng;
	private Double surgeMultiplier = 1.0;
	private LocalDateTime placedAt;
	private LocalDateTime deliveredAt;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
	private List<OrderItem> items;

	public enum OrderStatus {
		PLACED, CONFIRMED, PREPARING, PICKED_UP, DELIVERED, CANCELLED
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public Long getRestaurantId() {
		return restaurantId;
	}

	public void setRestaurantId(Long restaurantId) {
		this.restaurantId = restaurantId;
	}

	public Long getDeliveryPartnerId() {
		return deliveryPartnerId;
	}

	public void setDeliveryPartnerId(Long deliveryPartnerId) {
		this.deliveryPartnerId = deliveryPartnerId;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public String getDeliveryAddress() {
		return deliveryAddress;
	}

	public void setDeliveryAddress(String deliveryAddress) {
		this.deliveryAddress = deliveryAddress;
	}

	public Double getDeliveryLat() {
		return deliveryLat;
	}

	public void setDeliveryLat(Double deliveryLat) {
		this.deliveryLat = deliveryLat;
	}

	public Double getDeliveryLng() {
		return deliveryLng;
	}

	public void setDeliveryLng(Double deliveryLng) {
		this.deliveryLng = deliveryLng;
	}

	public Double getSurgeMultiplier() {
		return surgeMultiplier;
	}

	public void setSurgeMultiplier(Double surgeMultiplier) {
		this.surgeMultiplier = surgeMultiplier;
	}

	public LocalDateTime getPlacedAt() {
		return placedAt;
	}

	public void setPlacedAt(LocalDateTime placedAt) {
		this.placedAt = placedAt;
	}

	public LocalDateTime getDeliveredAt() {
		return deliveredAt;
	}

	public void setDeliveredAt(LocalDateTime deliveredAt) {
		this.deliveredAt = deliveredAt;
	}

	public List<OrderItem> getItems() {
		return items;
	}

	public void setItems(List<OrderItem> items) {
		this.items = items;
	}

	// ✅ PrePersist
	@PrePersist
	public void prePersist() {
		this.placedAt = LocalDateTime.now();
		this.status = OrderStatus.PLACED;
	}
}
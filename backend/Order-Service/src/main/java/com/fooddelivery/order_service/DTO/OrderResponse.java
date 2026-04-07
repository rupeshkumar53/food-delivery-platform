package com.fooddelivery.order_service.DTO;



import com.fooddelivery.order_service.Model.Order.OrderStatus;

public class OrderResponse {

	private Long id;
	private Long customerId;
	private Long restaurantId;
	private Long deliveryPartnerId;
	private String deliveryPartnerName;
	private OrderStatus status;
	private Double totalAmount;
	private String deliveryAddress;
	private java.time.LocalDateTime placedAt;
	private java.util.List<OrderItemRequest> items;

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

	public String getDeliveryPartnerName() {
		return deliveryPartnerName;
	}

	public void setDeliveryPartnerName(String deliveryPartnerName) {
		this.deliveryPartnerName = deliveryPartnerName;
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

	public java.time.LocalDateTime getPlacedAt() {
		return placedAt;
	}

	public void setPlacedAt(java.time.LocalDateTime placedAt) {
		this.placedAt = placedAt;
	}

	public java.util.List<OrderItemRequest> getItems() {
		return items;
	}

	public void setItems(java.util.List<OrderItemRequest> items) {
		this.items = items;
	}

}
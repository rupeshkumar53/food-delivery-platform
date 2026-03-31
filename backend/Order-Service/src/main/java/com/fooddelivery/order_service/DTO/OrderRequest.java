package com.fooddelivery.order_service.DTO;

import java.util.List;

public class OrderRequest {

	private Long restaurantId;
	private String deliveryAddress;
	private Double deliveryLat;
	private Double deliveryLng;
	private List<OrderItemRequest> items;

	public Long getRestaurantId() {
		return restaurantId;
	}

	public void setRestaurantId(Long restaurantId) {
		this.restaurantId = restaurantId;
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

	public List<OrderItemRequest> getItems() {
		return items;
	}

	public void setItems(List<OrderItemRequest> items) {
		this.items = items;
	}

}
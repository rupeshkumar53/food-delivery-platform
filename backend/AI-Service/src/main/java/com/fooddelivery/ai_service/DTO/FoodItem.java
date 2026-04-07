package com.fooddelivery.ai_service.DTO;

public class FoodItem {

	private String itemName;
	private String restaurantName;
	private String reason;
	private String estimatedPrice;

	
	public FoodItem(String itemName, String restaurantName, String reason, String estimatedPrice) {
		super();
		this.itemName = itemName;
		this.restaurantName = restaurantName;
		this.reason = reason;
		this.estimatedPrice = estimatedPrice;
	}

	public FoodItem() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public String getRestaurantName() {
		return restaurantName;
	}

	public void setRestaurantName(String restaurantName) {
		this.restaurantName = restaurantName;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getEstimatedPrice() {
		return estimatedPrice;
	}

	public void setEstimatedPrice(String estimatedPrice) {
		this.estimatedPrice = estimatedPrice;
	}

}
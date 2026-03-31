package com.fooddelivery.restaurant.DTO;

public class MenuItemRequest {
	private Long restaurantId;
	private String name;
	private String description;
	private Double price;
	private String category;
	private boolean isVeg;
	private String imageUrl;

	public MenuItemRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public MenuItemRequest(Long restaurantId, String name, String description, Double price, String category,
			boolean isVeg, String imageUrl) {
		super();
		this.restaurantId = restaurantId;
		this.name = name;
		this.description = description;
		this.price = price;
		this.category = category;
		this.isVeg = isVeg;
		this.imageUrl = imageUrl;
	}

	public Long getRestaurantId() {
		return restaurantId;
	}

	public void setRestaurantId(Long restaurantId) {
		this.restaurantId = restaurantId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public boolean isVeg() {
		return isVeg;
	}

	public void setVeg(boolean isVeg) {
		this.isVeg = isVeg;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
}
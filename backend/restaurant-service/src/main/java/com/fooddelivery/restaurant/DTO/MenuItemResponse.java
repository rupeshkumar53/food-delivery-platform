package com.fooddelivery.restaurant.DTO;

public class MenuItemResponse {
	private Long id;
	private Long restaurantId;
	private String name;
	private String description;
	private Double price;
	private String category;
	private boolean isVeg;
	private boolean isAvailable;
	private String imageUrl;

	public MenuItemResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public MenuItemResponse(Long id, Long restaurantId, String name, String description, Double price, String category,
			boolean isVeg, boolean isAvailable, String imageUrl) {
		super();
		this.id = id;
		this.restaurantId = restaurantId;
		this.name = name;
		this.description = description;
		this.price = price;
		this.category = category;
		this.isVeg = isVeg;
		this.isAvailable = isAvailable;
		this.imageUrl = imageUrl;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public boolean isAvailable() {
		return isAvailable;
	}

	public void setAvailable(boolean isAvailable) {
		this.isAvailable = isAvailable;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
}
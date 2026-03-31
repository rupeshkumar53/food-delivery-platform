package com.fooddelivery.restaurant.DTO;

public class RestaurantResponse {
    private Long id;
    private String name;
    private String cuisineType;
    private String address;
    private String city;
    private Double rating;
    private boolean isOpen;
    private Integer avgDeliveryTime;
    private Double minimumOrder;
//	public RestaurantResponse(Long id, String name, String cuisineType, String address, String city, Double rating,
//			boolean isOpen, Integer avgDeliveryTime, Double minimumOrder) {
//		super();
//		this.id = id;
//		this.name = name;
//		this.cuisineType = cuisineType;
//		this.address = address;
//		this.city = city;
//		this.rating = rating;
//		this.isOpen = isOpen;
//		this.avgDeliveryTime = avgDeliveryTime;
//		this.minimumOrder = minimumOrder;
//	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCuisineType() {
		return cuisineType;
	}
	public void setCuisineType(String cuisineType) {
		this.cuisineType = cuisineType;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public Double getRating() {
		return rating;
	}
	public void setRating(Double rating) {
		this.rating = rating;
	}
	public boolean isOpen() {
		return isOpen;
	}
	public void setOpen(boolean isOpen) {
		this.isOpen = isOpen;
	}
	public Integer getAvgDeliveryTime() {
		return avgDeliveryTime;
	}
	public void setAvgDeliveryTime(Integer avgDeliveryTime) {
		this.avgDeliveryTime = avgDeliveryTime;
	}
	public Double getMinimumOrder() {
		return minimumOrder;
	}
	public void setMinimumOrder(Double minimumOrder) {
		this.minimumOrder = minimumOrder;
	}
}
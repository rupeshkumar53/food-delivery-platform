package com.fooddelivery.restaurant.DTO;

public class RestaurantRequest {
    private String name;
    private String cuisineType;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private Integer avgDeliveryTime;
    private Double minimumOrder;
	public RestaurantRequest() {
		super();
		// TODO Auto-generated constructor stub
	}
	public RestaurantRequest(String name, String cuisineType, String address, String city, Double latitude,
			Double longitude, Integer avgDeliveryTime, Double minimumOrder) {
		super();
		this.name = name;
		this.cuisineType = cuisineType;
		this.address = address;
		this.city = city;
		this.latitude = latitude;
		this.longitude = longitude;
		this.avgDeliveryTime = avgDeliveryTime;
		this.minimumOrder = minimumOrder;
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
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
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
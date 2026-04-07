package com.fooddelivery.order_service.DTO;

public class DeliveryPartnerDTO {

	private Long id;
	private String name;
	private String phone;
	private String vehicleType;
	private Double currentLat;
	private Double currentLng;

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

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getVehicleType() {
		return vehicleType;
	}

	public void setVehicleType(String vehicleType) {
		this.vehicleType = vehicleType;
	}

	public Double getCurrentLat() {
		return currentLat;
	}

	public void setCurrentLat(Double currentLat) {
		this.currentLat = currentLat;
	}

	public Double getCurrentLng() {
		return currentLng;
	}

	public void setCurrentLng(Double currentLng) {
		this.currentLng = currentLng;
	}

}
package com.fooddelivery.restaurant.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Owner kaun hai (Auth Service ka userId)
    private Long ownerId;

    @Column(nullable = false)
    private String name;

    private String cuisineType;
    private String address;
    private String city;

    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "DECIMAL(2,1) DEFAULT 0.0")
    private Double rating;

    @Column(name = "is_open")
    private boolean isOpen = true;

    private Integer avgDeliveryTime; // minutes
    private Double minimumOrder;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = java.time.LocalDateTime.now();
    }

	public Restaurant() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Restaurant(Long id, Long ownerId, String name, String cuisineType, String address, String city,
			Double latitude, Double longitude, Double rating, boolean isOpen, Integer avgDeliveryTime,
			Double minimumOrder, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.ownerId = ownerId;
		this.name = name;
		this.cuisineType = cuisineType;
		this.address = address;
		this.city = city;
		this.latitude = latitude;
		this.longitude = longitude;
		this.rating = rating;
		this.isOpen = isOpen;
		this.avgDeliveryTime = avgDeliveryTime;
		this.minimumOrder = minimumOrder;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
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

	public java.time.LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(java.time.LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

}
package com.fooddelivery.ai_service.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class RecommendationResponse {

	private Long id;
	private Long customerId;
	private List<FoodItem> recommendations; // ← FoodItem directly
	private String city;
	private String timeOfDay;
	private LocalDateTime createdAt;
	private String message;

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

	public List<FoodItem> getRecommendations() {
		return recommendations;
	}

	public void setRecommendations(List<FoodItem> recommendations) {
		this.recommendations = recommendations;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getTimeOfDay() {
		return timeOfDay;
	}

	public void setTimeOfDay(String timeOfDay) {
		this.timeOfDay = timeOfDay;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
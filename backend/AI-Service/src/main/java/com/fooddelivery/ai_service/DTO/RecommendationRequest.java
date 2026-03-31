package com.fooddelivery.ai_service.DTO;

public class RecommendationRequest {

	private Long customerId;
	private String pastOrders; // "Pizza, Burger, Pasta"
	private String city;
	private String timeOfDay; // Morning/Afternoon/Evening/Night
	private String weather; // Hot/Cold/Rainy

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public String getPastOrders() {
		return pastOrders;
	}

	public void setPastOrders(String pastOrders) {
		this.pastOrders = pastOrders;
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

	public String getWeather() {
		return weather;
	}

	public void setWeather(String weather) {
		this.weather = weather;
	}

}
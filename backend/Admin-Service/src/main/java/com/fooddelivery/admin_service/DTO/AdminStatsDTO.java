package com.fooddelivery.admin_service.DTO;

public class AdminStatsDTO {
	private int totalUsers;
	private int totalRestaurants;
	private int totalDeliveryPartners;
	private int totalOrders;
	private int activeOrders;
	private int openRestaurants;
	private int availablePartners;
	private double totalRevenue;

	public int getTotalUsers() {
		return totalUsers;
	}

	public void setTotalUsers(int totalUsers) {
		this.totalUsers = totalUsers;
	}

	public int getTotalRestaurants() {
		return totalRestaurants;
	}

	public void setTotalRestaurants(int totalRestaurants) {
		this.totalRestaurants = totalRestaurants;
	}

	public int getTotalDeliveryPartners() {
		return totalDeliveryPartners;
	}

	public void setTotalDeliveryPartners(int totalDeliveryPartners) {
		this.totalDeliveryPartners = totalDeliveryPartners;
	}

	public int getTotalOrders() {
		return totalOrders;
	}

	public void setTotalOrders(int totalOrders) {
		this.totalOrders = totalOrders;
	}

	public int getActiveOrders() {
		return activeOrders;
	}

	public void setActiveOrders(int activeOrders) {
		this.activeOrders = activeOrders;
	}

	public int getOpenRestaurants() {
		return openRestaurants;
	}

	public void setOpenRestaurants(int openRestaurants) {
		this.openRestaurants = openRestaurants;
	}

	public int getAvailablePartners() {
		return availablePartners;
	}

	public void setAvailablePartners(int availablePartners) {
		this.availablePartners = availablePartners;
	}

	public double getTotalRevenue() {
		return totalRevenue;
	}

	public void setTotalRevenue(double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}

}
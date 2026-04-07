package com.fooddelivery.auth_service.dto;

import com.fooddelivery.auth_service.model.User;

public class UserDTO {

	private String name;
	private String email;
	private String city;
	private String country;
	private String phone;
	private String role;

	public UserDTO(User user) {
		this.name = user.getName();
		this.email = user.getEmail();
		this.city = user.getCity();
		this.country = user.getCountry();
		this.phone = user.getPhone();
		this.role = user.getRole().name();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

}
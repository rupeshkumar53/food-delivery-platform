package com.fooddelivery.auth_service.dto;

public class RegisterRequest {
	private String name;
	private String city;
	private String country;
	private String email;
	private String password;
	private String phone;
	private String role;

	public RegisterRequest() {
		super();
	}

	public RegisterRequest(String name, String city, String country, String email, String password, String phone,
			String role) {
		super();
		this.name = name;
		this.city = city;
		this.country = country;
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.role = role;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

package com.fooddelivery.admin_service.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ServiceUrlConfig {

	@Value("${auth.service.url}")
	public String authServiceUrl;

	@Value("${restaurant.service.url}")
	public String restaurantServiceUrl;

	@Value("${order.service.url}")
	public String orderServiceUrl;

	@Value("${delivery.service.url}")
	public String deliveryServiceUrl;

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}
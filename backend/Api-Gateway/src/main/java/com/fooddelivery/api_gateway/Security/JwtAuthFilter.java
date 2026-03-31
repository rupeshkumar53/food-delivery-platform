package com.fooddelivery.api_gateway.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

	@Autowired
	private JwtUtil jwtUtil;

	public JwtAuthFilter() {
		super(Config.class);
	}

	@Override
	public GatewayFilter apply(Config config) {
		return (exchange, chain) -> {

			String path = exchange.getRequest().getURI().getPath();

			// ✅ Yeh paths JWT check se exempt
			if (isPublicPath(path)) {
				return chain.filter(exchange);
			}

			// Authorization header check karo
			HttpHeaders headers = exchange.getRequest().getHeaders();

			if (!headers.containsKey(HttpHeaders.AUTHORIZATION)) {
				return onError(exchange, "No Authorization Header", HttpStatus.UNAUTHORIZED);
			}

			String authHeader = headers.getFirst(HttpHeaders.AUTHORIZATION);

			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				return onError(exchange, "Invalid Authorization Header", HttpStatus.UNAUTHORIZED);
			}

			// Token validate karo
			String token = authHeader.substring(7);

			if (!jwtUtil.isValid(token)) {
				return onError(exchange, "Invalid or Expired Token", HttpStatus.UNAUTHORIZED);
			}

			// ✅ User info headers mein add karo
			// Downstream services use karenge
			String email = jwtUtil.getEmail(token);
			String role = jwtUtil.getRole(token);

			ServerHttpRequest mutatedRequest = exchange.getRequest().mutate().header("X-User-Email", email)
					.header("X-User-Role", role).build();

			ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();

			return chain.filter(mutatedExchange);
		};
	}

	// Public paths — JWT nahi chahiye
	private boolean isPublicPath(String path) {
		return path.contains("/api/auth/login") || path.contains("/api/auth/register") || path.contains("/health")
				|| path.contains("/api/restaurants") && path.endsWith("/api/restaurants")
				|| path.contains("/api/delivery/available");
	}

	private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
		exchange.getResponse().setStatusCode(status);
		return exchange.getResponse().setComplete();
	}

	public static class Config {
		// Future config fields
	}
}
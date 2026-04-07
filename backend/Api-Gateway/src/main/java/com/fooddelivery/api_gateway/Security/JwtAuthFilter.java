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
			ServerHttpRequest request = exchange.getRequest();

			// ✅ CORS headers HATA DIYE — application.yml globalcors handle karega
			// ✅ OPTIONS preflight bhi HATA DIYA — Gateway khud handle karega

			String path = request.getURI().getPath();
			if (isPublicPath(path)) {
				return chain.filter(exchange);
			}

			HttpHeaders headers = request.getHeaders();
			if (!headers.containsKey(HttpHeaders.AUTHORIZATION)) {
				return onError(exchange, HttpStatus.UNAUTHORIZED);
			}

			String authHeader = headers.getFirst(HttpHeaders.AUTHORIZATION);
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				return onError(exchange, HttpStatus.UNAUTHORIZED);
			}

			String token = authHeader.substring(7);
			if (!jwtUtil.isValid(token)) {
				return onError(exchange, HttpStatus.UNAUTHORIZED);
			}

			String email = jwtUtil.getEmail(token);
			String role = jwtUtil.getRole(token);

			ServerHttpRequest mutatedRequest = request.mutate().header("X-User-Email", email)
					.header("X-User-Role", role).build();

			ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();

			return chain.filter(mutatedExchange);
		};
	}

	private boolean isPublicPath(String path) {
		return path.contains("/api/auth/login") || path.contains("/api/auth/register") || path.contains("/health") ||
		// ✅ Admin service sab allow
				path.startsWith("/api/admin/") || path.contains("/api/delivery/available")
				|| path.contains("/api/delivery/nearest") || path.contains("/api/restaurants")
				|| path.contains("/api/delivery/partner-by-user/") || path.equals("/api/restaurants")
				|| path.contains("/api/ai/recommendations");
	}

	private Mono<Void> onError(ServerWebExchange exchange, HttpStatus status) {
		exchange.getResponse().setStatusCode(status);
		return exchange.getResponse().setComplete();
	}

	public static class Config {
		// Future config fields
	}
}
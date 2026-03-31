package com.fooddelivery.api_gateway.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;

@Component
public class JwtUtil {

	// ✅ Same secret — sabhi services jaisa
	private final String secret = "fooddelivery_secret_key_min_32_chars_long";

	public boolean isValid(String token) {
		try {
			getClaims(token);
			return true;
		} catch (JwtException e) {
			return false;
		}
	}

	public String getEmail(String token) {
		return getClaims(token).getSubject();
	}

	public String getRole(String token) {
		return getClaims(token).get("role", String.class);
	}

	private Claims getClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
	}

	private Key getKey() {
		return Keys.hmacShaKeyFor(secret.getBytes());
	}
}
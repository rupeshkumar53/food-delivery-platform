package com.fooddelivery.admin_service.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;

@Component
public class JwtUtil {

	@Value("${jwt.secret}")
	private String secret;

	public String getEmail(String token) {
		return getClaims(token).getSubject();
	}

	public String getRole(String token) {
		return getClaims(token).get("role", String.class);
	}

	public boolean isValid(String token) {
		try {
			getClaims(token);
			return true;
		} catch (JwtException e) {
			return false;
		}
	}

	private Claims getClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
	}

	private Key getKey() {
		return Keys.hmacShaKeyFor(secret.getBytes());
	}
}
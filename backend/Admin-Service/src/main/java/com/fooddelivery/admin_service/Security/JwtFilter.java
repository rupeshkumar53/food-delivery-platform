package com.fooddelivery.admin_service.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation
    .Autowired;
import org.springframework.security.authentication
    .UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority
    .SimpleGrantedAuthority;
import org.springframework.security.core.context
    .SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter
    .OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // ✅ OPTIONS preflight — directly pass karo
        if ("OPTIONS".equalsIgnoreCase(
                request.getMethod())) {
            response.setHeader(
                "Access-Control-Allow-Origin", "*");
            response.setHeader(
                "Access-Control-Allow-Methods",
                "GET,POST,PUT,DELETE,OPTIONS");
            response.setHeader(
                "Access-Control-Allow-Headers", "*");
            response.setStatus(200);
            return;
        }

        String authHeader = request
            .getHeader("Authorization");

        if (authHeader != null &&
            authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                if (jwtUtil.isValid(token)) {
                    String email =
                        jwtUtil.getEmail(token);
                    String role =
                        jwtUtil.getRole(token);

                    System.out.println(
                        "✅ JWT Valid — " +
                        email + " [" + role + "]");

                    UsernamePasswordAuthenticationToken
                        auth =
                        new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(
                                new SimpleGrantedAuthority(
                                    "ROLE_" + role
                                )
                            )
                        );

                    SecurityContextHolder
                        .getContext()
                        .setAuthentication(auth);
                }
            } catch (Exception e) {
                System.out.println(
                    "❌ JWT Error: " +
                    e.getMessage());
                // ✅ Redirect mat karo —
                //    bas aage badho
            }
        }

        filterChain.doFilter(request, response);
    }
}
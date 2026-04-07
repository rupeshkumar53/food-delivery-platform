package com.fooddelivery.admin_service.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // ✅ CORS — Gateway handle karega, yahan disable
                .cors(cors -> cors.disable())
                // ✅ CSRF disable
                .csrf(csrf -> csrf.disable())
                // ✅ Stateless
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // ✅ Form login disable
                .formLogin(form -> form.disable())
                // ✅ HTTP Basic disable
                .httpBasic(basic -> basic.disable())
                // ✅ Sab allow — JWT filter handle karega
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                // ✅ JWT filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ❌ corsConfigurationSource() bean BILKUL NAHI — Gateway karega yeh kaam
}
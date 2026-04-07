package com.fooddelivery.auth_service.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.fooddelivery.auth_service.dto.AuthResponse;
import com.fooddelivery.auth_service.dto.LoginRequest;
import com.fooddelivery.auth_service.dto.RegisterRequest;
import com.fooddelivery.auth_service.dto.UserDTO;
import com.fooddelivery.auth_service.model.User;
import com.fooddelivery.auth_service.repository.UserRepository;
import com.fooddelivery.auth_service.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Register
    public AuthResponse register(
            RegisterRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {
            throw new RuntimeException(
                "Email already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setPassword(passwordEncoder.encode(
            request.getPassword()));
        user.setPhone(request.getPhone());

        try {
            user.setRole(User.Role.valueOf(
                request.getRole().toUpperCase()));
        } catch (Exception e) {
            throw new RuntimeException(
                "Invalid role: " + request.getRole());
        }

        user.setActive(true);
        // ✅ Save karke id lo
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(
            savedUser.getEmail(),
            savedUser.getRole().name());

        // ✅ userId bhi bhejo
        return new AuthResponse(
            token,
            savedUser.getRole().name(),
            savedUser.getName(),
            "Registration successful!",
            savedUser.getId()  // ← userId
        );
    }

    // Login
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() ->
                new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException(
                "Invalid password!");
        }

        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().name());

        // ✅ userId bhi bhejo
        return new AuthResponse(
            token,
            user.getRole().name(),
            user.getName(),
            "Login successful!",
            user.getId()  // ← userId
        );
    }
    // all user details
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findByRole(User.Role.CUSTOMER);

        return users.stream()
                .map(user -> new UserDTO(user))
                .toList();
    }
}
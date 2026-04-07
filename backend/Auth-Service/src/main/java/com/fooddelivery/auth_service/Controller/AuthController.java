package com.fooddelivery.auth_service.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.auth_service.Service.AuthService;
import com.fooddelivery.auth_service.dto.AuthResponse;
import com.fooddelivery.auth_service.dto.LoginRequest;
import com.fooddelivery.auth_service.dto.RegisterRequest;
import com.fooddelivery.auth_service.dto.UserDTO;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
	//	return ResponseEntity.ok(authService.register(request));
		AuthResponse resposne = authService.register(request);
		System.out.println(" response :" +resposne);
		return new ResponseEntity<>(resposne,HttpStatus.OK);
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}

	// Health check
	@GetMapping("/health")
	public ResponseEntity<String> health() {
		return ResponseEntity.ok("Auth Service is UP! ✅");
	}
	//
	@GetMapping("/all-users")
	public ResponseEntity<List<UserDTO>> getAllUsers() {
	    return ResponseEntity.ok(authService.getAllUsers());
	}
}

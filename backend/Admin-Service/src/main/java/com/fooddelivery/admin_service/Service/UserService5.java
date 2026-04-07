//package com.fooddelivery.admin_service.Service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.fooddelivery.admin_service.DTO.UserDTO;
//import com.fooddelivery.admin_service.Repository.UserRepository;
//
//import java.util.List;
//
//@Service
//@Transactional
//public class UserService5 {
//	
//	@Autowired
//    private UserRepository userRepository;
//
//	// All users
//	public List<UserDTO> getAllUsers() {
//		return userRepository.findAll()
//	        .stream()
//	        .map(this::toDTO)
//	        .collect(java.util.stream
//	            .Collectors.toList());
//	}
//
//	// Delete user
//	public void deleteUser(Long id) {
//	    userRepository.deleteById(id);
//	}
//
//	// Entity → DTO
//	private UserDTO toDTO(User user) {
//	    UserDTO dto = new UserDTO();
//	    dto.setId(user.getId());
//	    dto.setName(user.getName());
//	    dto.setEmail(user.getEmail());
//	    dto.setPhone(user.getPhone());
//	    dto.setCity(user.getCity());
//	    dto.setCountry(user.getCountry());
//	    dto.setRole(user.getRole().name());
//	    dto.setActive(user.isActive());
//	    return dto;
//	}
//}
package com.fooddelivery.ai_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.ai_service.Model.Recommendation;

import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

	List<Recommendation> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
package com.fooddelivery.ai_service.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.ai_service.DTO.RecommendationRequest;
import com.fooddelivery.ai_service.DTO.RecommendationResponse;
import com.fooddelivery.ai_service.Model.Recommendation;
import com.fooddelivery.ai_service.Service.AiService;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiService aiService;

    // Food recommendations lo
    @PostMapping("/recommendations")
    public ResponseEntity<RecommendationResponse>
            getRecommendations(
            @RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(
            aiService.getRecommendations(request));
    }

    // Past recommendations history
    @GetMapping("/history/{customerId}")
    public ResponseEntity<List<Recommendation>>
            getHistory(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(
            aiService.getHistory(customerId));
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
            "AI Service is UP! ✅");
    }
}
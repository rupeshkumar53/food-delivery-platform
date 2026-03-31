package com.fooddelivery.ai_service.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fooddelivery.ai_service.DTO.FoodItem;
import com.fooddelivery.ai_service.DTO.RecommendationRequest;
import com.fooddelivery.ai_service.DTO.RecommendationResponse;
import com.fooddelivery.ai_service.Model.Recommendation;
import com.fooddelivery.ai_service.Repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class AiService {

	@Autowired
	private RecommendationRepository recommendationRepository;

	@Value("${gemini.api.key}")
	private String geminiApiKey;

	@Value("${gemini.api.url}")
	private String geminiApiUrl;

	private final RestTemplate restTemplate = new RestTemplate();
	private final ObjectMapper objectMapper = new ObjectMapper();

	public RecommendationResponse getRecommendations(RecommendationRequest request) {

		String prompt = buildPrompt(request);
		String aiResponseText = callGeminiApi(prompt);

		// ✅ FileItem → FoodItem
		List<FoodItem> items = parseAiResponse(aiResponseText);

		Recommendation rec = new Recommendation();
		rec.setCustomerId(request.getCustomerId());
		rec.setCity(request.getCity());
		rec.setTimeOfDay(request.getTimeOfDay());
		rec.setAiResponse(aiResponseText);
		rec.setRecommendedItems(aiResponseText);
		Recommendation saved = recommendationRepository.save(rec);

		RecommendationResponse response = new RecommendationResponse();
		response.setId(saved.getId());
		response.setCustomerId(request.getCustomerId());
		response.setRecommendations(items);
		response.setCity(request.getCity());
		response.setTimeOfDay(request.getTimeOfDay());
		response.setCreatedAt(saved.getCreatedAt());
		response.setMessage("AI recommendations ready!");

		return response;
	}

	private String buildPrompt(RecommendationRequest request) {
		return String.format("""
				You are a food recommendation AI for an
				Indian food delivery app.

				Customer Details:
				- Past Orders: %s
				- City: %s
				- Time of Day: %s
				- Weather: %s

				Suggest 5 food items they might enjoy.

				Return ONLY this JSON array, nothing else:
				[
				  {
				    "itemName": "food name",
				    "restaurantName": "restaurant name",
				    "reason": "why recommended",
				    "estimatedPrice": "price in INR"
				  }
				]
				""", request.getPastOrders(), request.getCity(), request.getTimeOfDay(), request.getWeather());
	}

	private String callGeminiApi(String prompt) {
		try {
			String url = geminiApiUrl + "?key=" + geminiApiKey;

			Map<String, Object> requestBody = new HashMap<>();
			Map<String, Object> content = new HashMap<>();
			Map<String, Object> part = new HashMap<>();

			part.put("text", prompt);
			content.put("parts", List.of(part));
			requestBody.put("contents", List.of(content));

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

			ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

			JsonNode root = objectMapper.readTree(response.getBody());
			return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

		} catch (Exception e) {
			return getFallbackResponse();
		}
	}

	// ✅ FoodItem — sahi
	private List<FoodItem> parseAiResponse(String aiText) {
		try {
			int start = aiText.indexOf("[");
			int end = aiText.lastIndexOf("]") + 1;

			if (start >= 0 && end > start) {
				String jsonArray = aiText.substring(start, end);
				JsonNode array = objectMapper.readTree(jsonArray);

				List<FoodItem> items = new ArrayList<>();
				for (JsonNode node : array) {
					FoodItem item = new FoodItem();
					item.setItemName(node.path("itemName").asText());
					item.setRestaurantName(node.path("restaurantName").asText());
					item.setReason(node.path("reason").asText());
					item.setEstimatedPrice(node.path("estimatedPrice").asText());
					items.add(item);
				}
				return items;
			}
		} catch (Exception e) {
			System.out.println("Parse error: " + e.getMessage());
		}
		return getDefaultItems();
	}

	private String getFallbackResponse() {
		return """
				[
				  {
				    "itemName": "Butter Chicken",
				    "restaurantName": "Punjabi Dhaba",
				    "reason": "Most popular item",
				    "estimatedPrice": "₹280"
				  },
				  {
				    "itemName": "Paneer Tikka",
				    "restaurantName": "Spice Garden",
				    "reason": "Highly rated veg option",
				    "estimatedPrice": "₹220"
				  },
				  {
				    "itemName": "Veg Biryani",
				    "restaurantName": "Biryani House",
				    "reason": "Perfect for this time",
				    "estimatedPrice": "₹199"
				  }
				]
				""";
	}

	// ✅ FoodItem — sahi
	private List<FoodItem> getDefaultItems() {
		List<FoodItem> items = new ArrayList<>();

		FoodItem item1 = new FoodItem();
		item1.setItemName("Butter Chicken");
		item1.setRestaurantName("Punjabi Dhaba");
		item1.setReason("Most popular item");
		item1.setEstimatedPrice("₹280");
		items.add(item1);

		FoodItem item2 = new FoodItem();
		item2.setItemName("Veg Biryani");
		item2.setRestaurantName("Biryani House");
		item2.setReason("Chef's special today");
		item2.setEstimatedPrice("₹199");
		items.add(item2);

		return items;
	}

	public List<Recommendation> getHistory(Long customerId) {
		return recommendationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
	}
}

package com.fooddelivery.ai_service.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fooddelivery.ai_service.DTO.*;
import com.fooddelivery.ai_service.Model.Recommendation;
import com.fooddelivery.ai_service.Repository.RecommendationRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.time.Duration;
import java.util.*;

@Service
public class AiService {

	@Autowired
	private RecommendationRepository repository;

	@Value("${gemini.api.key}")
	private String apiKey;

	@Value("${gemini.api.url}")
	private String apiUrl;

	private final WebClient webClient = WebClient.builder().baseUrl("").build();

	private final ObjectMapper mapper = new ObjectMapper();

	@CircuitBreaker(name = "aiService", fallbackMethod = "fallback")
	@Retry(name = "aiService")
	public RecommendationResponse getRecommendations(RecommendationRequest request) {

		String prompt = buildPrompt(request);
		String aiText = callGemini(prompt);

		List<FoodItem> items = parse(aiText);

		Recommendation rec = new Recommendation();
		rec.setCustomerId(request.getCustomerId());
		rec.setCity(request.getCity());
		rec.setTimeOfDay(request.getTimeOfDay());
		rec.setAiResponse(aiText);

		try {
			rec.setRecommendedItems(mapper.writeValueAsString(items));
		} catch (Exception ignored) {
		}

		Recommendation saved = repository.save(rec);

		RecommendationResponse res = new RecommendationResponse();
		res.setId(saved.getId());
		res.setCustomerId(request.getCustomerId());
		res.setRecommendations(items);
		res.setMessage("AI recommendations ready!");

		return res;
	}

	private String callGemini(String prompt) {

		Map<String, Object> body = Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));

		String url = apiUrl + "?key=" + apiKey;

		return webClient.post().uri(url).bodyValue(body).retrieve().bodyToMono(String.class)
				.timeout(Duration.ofSeconds(5)).block();
	}

	private List<FoodItem> parse(String text) {
		try {
			JsonNode root = mapper.readTree(text);

			JsonNode candidates = root.path("candidates");
			if (!candidates.isArray() || candidates.size() == 0) {
				return defaultItems();
			}

			String aiText = candidates.get(0).path("content").path("parts").get(0).path("text").asText();

			int start = aiText.indexOf("[");
			int end = aiText.lastIndexOf("]") + 1;

			if (start < 0 || end <= start)
				return defaultItems();

			JsonNode array = mapper.readTree(aiText.substring(start, end));

			List<FoodItem> list = new ArrayList<>();
			for (JsonNode node : array) {
				FoodItem item = new FoodItem();
				item.setItemName(node.path("itemName").asText());
				item.setRestaurantName(node.path("restaurantName").asText());
				item.setReason(node.path("reason").asText());
				item.setEstimatedPrice(node.path("estimatedPrice").asText());
				list.add(item);
			}
			return list;

		} catch (Exception e) {
			return defaultItems();
		}
	}

	public RecommendationResponse fallback(RecommendationRequest request, Exception ex) {

		List<FoodItem> items = defaultItems();

		RecommendationResponse res = new RecommendationResponse();
		res.setCustomerId(request.getCustomerId());
		res.setRecommendations(items);
		res.setMessage("Fallback recommendations (AI unavailable)");

		return res;
	}

	private List<FoodItem> defaultItems() {
		return List.of(new FoodItem("Butter Chicken", "Punjabi Dhaba", "Popular item", "₹280"),
				new FoodItem("Paneer Tikka", "Spice Garden", "Veg option", "₹220"),
				new FoodItem("Veg Biryani", "Biryani House", "Best for lunch", "₹199"));
	}

	private String buildPrompt(RecommendationRequest req) {
		return "Suggest 5 food items in JSON for city: " + req.getCity();
	}

	public List<Recommendation> getHistory(Long customerId) {
		return repository.findByCustomerIdOrderByCreatedAtDesc(customerId);
	}
}
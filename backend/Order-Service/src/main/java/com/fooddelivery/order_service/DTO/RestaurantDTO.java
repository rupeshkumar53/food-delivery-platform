package com.fooddelivery.order_service.DTO;

// ✅ Ye DTO order-service mein banao
// Restaurant Service ka response map karne ke liye
public class RestaurantDTO {

    private Long id;
    private String name;
    private String cuisineType;
    private String address;
    private String city;
    private Double rating;
    private boolean open;
    private Integer avgDeliveryTime;
    private Double minimumOrder;

    // ✅ Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCuisineType() { return cuisineType; }
    public void setCuisineType(String cuisineType) {
        this.cuisineType = cuisineType;
    }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public boolean isOpen() { return open; }
    public void setOpen(boolean open) { this.open = open; }

    public Integer getAvgDeliveryTime() { return avgDeliveryTime; }
    public void setAvgDeliveryTime(Integer avgDeliveryTime) {
        this.avgDeliveryTime = avgDeliveryTime;
    }

    public Double getMinimumOrder() { return minimumOrder; }
    public void setMinimumOrder(Double minimumOrder) {
        this.minimumOrder = minimumOrder;
    }
}
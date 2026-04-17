🍕 AI-Powered Food Delivery Platform

📌 Project Overview
A complete Zomato/Swiggy-inspired food delivery platform featuring AI-powered recommendations, real-time order tracking, automated rider assignment using the Haversine Formula, and role-based dashboards for Customers, Restaurants, Riders, and Admins.
Built as a career gap project to demonstrate production-level Java + Spring Boot + Microservices skills.

✨ Features
👤 Customer

Browse restaurants by city
View menu with veg/non-veg filters
Add to cart (single restaurant restriction)
Place orders with real-time tracking
View complete order history with delivery partner details
AI-powered food recommendations

🍽️ Restaurant

Register & manage multiple restaurants
Add/manage menu items (category, price, veg/non-veg)
Real-time order dashboard with filter tabs
Accept/reject/update order status
Revenue & delivery analytics

🛵 Rider

Register with vehicle & document details
Online/Offline toggle
Auto-assignment via Haversine nearest algorithm
Real-time order dashboard
Earnings tracking (today + total)
Location auto-update

👑 Admin

Complete platform analytics dashboard
Manage all users, restaurants, riders, orders
Order status breakdown with progress bars
Revenue tracking
Delete any entity


🏗️ System Architecture
┌─────────────────────────────────────────────────────────┐
│                    React.js Frontend                     │
│              localhost:3000                              │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (Axios)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              API Gateway (Spring Cloud)                  │
│              localhost:9091                              │
│         JWT Filter | Rate Limiting | Routing             │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Eureka Service Registry                     │
│              localhost:9090                              │
└──────┬───────┬───────┬───────┬───────┬───────┬──────────┘
       │       │       │       │       │       │
       ▼       ▼       ▼       ▼       ▼       ▼
  ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │  Auth  │ │Resto.│ │Order │ │Rider │ │Pay.  │ │  AI  │
  │  9092  │ │ 9093 │ │ 9094 │ │ 9095 │ │ 9096 │ │ 9097 │
  └────┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
       │        │        │        │        │        │
       ▼        ▼        ▼        ▼        ▼        ▼
  ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │auth_db │ │resto │ │order │ │deliv.│ │pay.  │ │ai_db │
  │(MySQL) │ │ _db  │ │ _db  │ │ _db  │ │ _db  │ │      │
  └────────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘

🧩 Microservices Breakdown
ServicePortResponsibilityDatabaseEureka Server9090Service Discovery & Registry—API Gateway9091Routing, JWT Filter, Load Balancing—Auth Service9092Register, Login, JWT Token, User Managementauth_dbRestaurant Service9093Restaurant CRUD, Menu Managementrestaurant_dbOrder Service9094Order Placement, Status Trackingorder_dbRider Service9095Rider Registration, Assignment, Earningsdelivery_dbPayment Service9096Payment Initiation, Confirmation, Refundpayment_dbAI Service9097Gemini AI Food Recommendationsai_db

🛠️ Tech Stack
Backend
Java 17              → Core Language
Spring Boot 3.2.5    → Microservices Framework
Spring Security      → Authentication & Authorization
Spring Cloud Gateway → API Gateway
Eureka Server        → Service Discovery
Spring Data JPA      → ORM
Hibernate            → Database Mapping
JWT (JJWT 0.11.5)   → Token-based Security
RestTemplate         → Inter-service Communication
Frontend
React.js 18          → UI Framework
React Router v6      → Client-side Routing
Axios                → HTTP Client
Context API          → State Management
Database
MySQL 8.0            → Primary Database (6 instances)
Database-per-Service → Microservices Pattern
DevOps & Tools
Docker               → Containerization
Docker Compose       → Multi-container Orchestration
Git & GitHub         → Version Control
Postman              → API Testing
MySQL Workbench      → Database Management
STS / IntelliJ IDEA  → IDE
AI & External APIs
Google Gemini API    → AI Food Recommendations
Haversine Formula    → Geospatial Nearest Rider

👥 User Roles & Access
CUSTOMER    → Browse, Order, Track, History
RESTAURANT  → Menu Management, Order Dashboard
RIDER       → Accept Orders, Earnings, Toggle Online
ADMIN       → Full Platform Control, Analytics

🌐 API Endpoints
Auth Service
POST   /api/auth/register          → Register user
POST   /api/auth/login             → Login & get JWT
GET    /api/auth/user/{id}         → Get user by ID
GET    /api/auth/all-users         → All users (Admin)
DELETE /api/auth/users/{id}        → Delete user (Admin)

Restaurant Service
POST   /api/restaurants/create     → Create restaurant
GET    /api/restaurants?city=Noida → Get by city
GET    /api/restaurants/{id}       → Single restaurant
GET    /api/restaurants/owner/{id} → Owner's restaurants
GET    /api/restaurants/all        → All (Admin)
PUT    /api/restaurants/{id}/toggle → Open/Close
DELETE /api/restaurants/{id}       → Delete (Admin)

POST   /api/menu/add               → Add menu item
GET    /api/menu/{restaurantId}    → Get menu
PUT    /api/menu/{id}/toggle       → Availability

Order Service
POST   /api/orders/place           → Place order
GET    /api/orders/{id}            → Order details
GET    /api/orders/my-orders       → Customer orders
PUT    /api/orders/{id}/cancel     → Cancel order
PUT    /api/orders/{id}/status     → Update status
GET    /api/orders/restaurant-orders → Restaurant orders
GET    /api/orders/delivery-orders → Rider orders
GET    /api/orders/all             → All (Admin)
DELETE /api/orders/{id}            → Delete (Admin)

Rider Service
POST   /api/rider/register         → Register rider
GET    /api/rider/nearest          → Nearest available
GET    /api/rider/by-user/{userId} → Rider profile
GET    /api/rider/{id}             → By ID
PUT    /api/rider/location         → Update location
PUT    /api/rider/toggle           → Online/Offline
PUT    /api/rider/complete         → Complete delivery
GET    /api/rider/available        → Available riders
GET    /api/rider/all              → All (Admin)
DELETE /api/rider/{id}             → Delete (Admin)

AI Service
POST   /api/ai/recommendations     → Get AI food suggestions
GET    /api/ai/history/{customerId} → Past recommendations

🔐 Security Flow
1. User registers/logs in → Auth Service
2. JWT Token generated (24hr expiry)
3. Token stored in localStorage (React)
4. Every API request → Bearer token in header
5. API Gateway validates JWT
6. Request forwarded to microservice
7. Role-based access enforced (@PreAuthorize)

🤖 AI Integration Flow
Customer opens app
      ↓
React calls /api/ai/recommendations
with: pastOrders, city, timeOfDay, weather
      ↓
AI Service builds Gemini prompt
      ↓
Gemini API returns JSON suggestions
      ↓
Response parsed & stored in DB
      ↓
Customer sees personalized recommendations ✅

🛵 Rider Auto-Assignment Flow
Customer places order
      ↓
Order Service calls /api/rider/nearest
?lat=28.57&lng=77.32
      ↓
Rider Service fetches all available APPROVED riders
      ↓
Haversine formula calculates distances
      ↓
Nearest rider selected
isAvailable = false
      ↓
deliveryPartnerId saved in order
      ↓
Rider dashboard shows order ✅

🚀 Setup & Installation
Prerequisites
✅ Java 17+
✅ Maven 3.8+
✅ MySQL 8.0
✅ Node.js 18+
✅ Docker (optional)

📱 Application Flow
1. Register as Customer/Restaurant/Rider/Admin
2. Customer → Browse restaurants → Add to cart → Place order
3. Restaurant → Confirm → Prepare order
4. Rider auto-assigned → Pick up → Deliver
5. Customer tracks real-time status
6. Earnings automatically calculated for rider

🏆 Key Achievements
✅ 8 Independent Microservices
✅ 6 Separate MySQL Databases  
✅ JWT Authentication + Role-based Access
✅ AI-powered recommendations (Gemini)
✅ Real-time order tracking
✅ Haversine nearest rider algorithm
✅ Rider earnings tracking system
✅ Complete Admin analytics dashboard
✅ Docker containerization
✅ Production-ready error handling

📂 Project Structure
food-delivery-platform/
├── eureka-server/
├── api-gateway/
├── auth-service/
├── restaurant-service/
├── order-service/
├── rider-service/
├── payment-service/
├── ai-service/
├── frontend/
│   └── food-delivery-ui/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Home.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── RestaurantDetail.jsx
│       │   │   ├── Cart.jsx
│       │   │   ├── MyOrders.jsx
│       │   │   ├── OrderTracking.jsx
│       │   │   ├── RestaurantDashboard.jsx
│       │   │   ├── RiderRegister.jsx
│       │   │   ├── RiderDashboard.jsx
│       │   │   ├── AdminDashboard.jsx
│       │   │   └── AddRestaurant.jsx
│       │   ├── services/
│       │   │   ├── api.js
│       │   │   ├── authService.js
│       │   │   ├── restaurantService.js
│       │   │   ├── orderService.js
│       │   │   └── riderService.js
│       │   └── context/
│       │       ├── AuthContext.jsx
│       │       └── CartContext.jsx
│       └── package.json
├── docker-compose.yml
└── README.md

👨‍💻 Developer
Rupesh Kumar

💼 Java Developer | Spring Boot | Microservices
📍 Noida, India
🔗 LinkedIn: https://www.linkedin.com/in/rupesh-kumar-92a680229
📧 rupeshsahh53@gmail.com
+91-9939526453

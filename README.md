# 🍕 AI-Powered Food Delivery Platform

> A production-grade Zomato/Swiggy-inspired platform built with **Java 17 + Spring Boot 3 + Microservices Architecture**

[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)](https://java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green?style=for-the-badge&logo=springboot)](https://spring.io)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://mysql.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)](https://docker.com)

---

## 📌 Project Overview

A complete food delivery platform featuring:
- 🤖 **AI-powered food recommendations** using Google Gemini API
- 📍 **Real-time order tracking**
- 🛵 **Auto rider assignment** using Haversine Formula
- 🔐 **JWT-based authentication** with Role-Based Access Control
- 🏗️ **8 independent microservices** with separate databases

---

## ✨ Features by Role

<details>
<summary>👤 <b>Customer</b></summary>

- Browse restaurants by city
- View menu with veg/non-veg filters
- Add to cart (single restaurant restriction)
- Place orders with real-time tracking
- View complete order history
- AI-powered food recommendations

</details>

<details>
<summary>🍽️ <b>Restaurant</b></summary>

- Register & manage multiple restaurants
- Add/manage menu items (category, price, veg/non-veg)
- Real-time order dashboard with filter tabs
- Accept/reject/update order status
- Revenue & delivery analytics

</details>

<details>
<summary>🛵 <b>Rider</b></summary>

- Register with vehicle & document details
- Online/Offline toggle
- Auto-assignment via Haversine nearest algorithm
- Real-time order dashboard
- Earnings tracking (today + total)

</details>

<details>
<summary>👑 <b>Admin</b></summary>

- Complete platform analytics dashboard
- Manage all users, restaurants, riders, orders
- Order status breakdown with progress bars
- Revenue tracking
- Delete any entity

</details>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────┐
│         React.js Frontend           │
│           localhost:3000            │
└──────────────┬──────────────────────┘
               │ HTTP (Axios)
               ▼
┌─────────────────────────────────────┐
│     API Gateway (Spring Cloud)      │
│           localhost:9091            │
│   JWT Filter | Routing | Rate Limit │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Eureka Service Registry       │
│           localhost:9090            │
└──┬──────┬──────┬──────┬──────┬──────┘
   │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼
 Auth  Restaurant Order  Rider  Pay.  AI
 9092   9093    9094   9095   9096  9097
```

---

## 🧩 Microservices Breakdown

| Service | Port | Responsibility | Database |
|---|---|---|---|
| Eureka Server | 9090 | Service Discovery & Registry | — |
| API Gateway | 9091 | Routing, JWT Filter, Load Balancing | — |
| Auth Service | 9092 | Register, Login, JWT Token | auth_db |
| Restaurant Service | 9093 | Restaurant CRUD, Menu Management | restaurant_db |
| Order Service | 9094 | Order Placement, Status Tracking | order_db |
| Rider Service | 9095 | Rider Registration, Assignment | delivery_db |
| Payment Service | 9096 | Payment Initiation, Confirmation | payment_db |
| AI Service | 9097 | Gemini AI Food Recommendations | ai_db |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Core Language |
| Spring Boot 3.2.5 | Microservices Framework |
| Spring Security | Authentication & Authorization |
| Spring Cloud Gateway | API Gateway |
| Eureka Server | Service Discovery |
| Spring Data JPA + Hibernate | ORM & Database Mapping |
| JWT (JJWT 0.11.5) | Token-based Security |
| RestTemplate | Inter-service Communication |

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI Framework |
| React Router v6 | Client-side Routing |
| Axios | HTTP Client |
| Context API | State Management |

### Database & DevOps
| Technology | Purpose |
|---|---|
| MySQL 8.0 | Primary Database (6 instances) |
| Docker & Docker Compose | Containerization |
| Git & GitHub | Version Control |
| Postman | API Testing |

### AI & External APIs
| Technology | Purpose |
|---|---|
| Google Gemini API | AI Food Recommendations |
| Haversine Formula | Geospatial Nearest Rider |

---

## 🔐 Security Flow

```
User Login → Auth Service
     ↓
JWT Token Generated (24hr expiry)
     ↓
Token stored in localStorage (React)
     ↓
Every API Request → Bearer token in header
     ↓
API Gateway validates JWT
     ↓
Request forwarded to microservice
     ↓
Role-based access enforced (@PreAuthorize)
```

---

## 🤖 AI Recommendation Flow

```
Customer opens app
     ↓
React calls /api/ai/recommendations
(pastOrders, city, timeOfDay, weather)
     ↓
AI Service builds Gemini prompt
     ↓
Gemini API returns JSON suggestions
     ↓
Response parsed & stored in DB
     ↓
Customer sees personalized recommendations ✅
```

---

## 🛵 Rider Auto-Assignment Flow

```
Customer places order
     ↓
Order Service calls /api/rider/nearest
     ↓
Rider Service fetches all available riders
     ↓
Haversine formula calculates distances
     ↓
Nearest rider selected → isAvailable = false
     ↓
Rider dashboard shows new order ✅
```

---

## 🌐 API Endpoints

<details>
<summary>🔐 <b>Auth Service</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/user/{id}` | Get user by ID |
| GET | `/api/auth/all-users` | All users (Admin) |
| DELETE | `/api/auth/users/{id}` | Delete user (Admin) |

</details>

<details>
<summary>🍽️ <b>Restaurant Service</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/restaurants/create` | Create restaurant |
| GET | `/api/restaurants?city=Noida` | Get by city |
| GET | `/api/restaurants/{id}` | Single restaurant |
| PUT | `/api/restaurants/{id}/toggle` | Open/Close |
| DELETE | `/api/restaurants/{id}` | Delete (Admin) |
| POST | `/api/menu/add` | Add menu item |
| GET | `/api/menu/{restaurantId}` | Get menu |

</details>

<details>
<summary>📦 <b>Order Service</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders/place` | Place order |
| GET | `/api/orders/{id}` | Order details |
| GET | `/api/orders/my-orders` | Customer orders |
| PUT | `/api/orders/{id}/cancel` | Cancel order |
| PUT | `/api/orders/{id}/status` | Update status |

</details>

<details>
<summary>🛵 <b>Rider Service</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rider/register` | Register rider |
| GET | `/api/rider/nearest` | Nearest available |
| PUT | `/api/rider/location` | Update location |
| PUT | `/api/rider/toggle` | Online/Offline |
| PUT | `/api/rider/complete` | Complete delivery |

</details>

<details>
<summary>🤖 <b>AI Service</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/recommendations` | Get AI suggestions |
| GET | `/api/ai/history/{customerId}` | Past recommendations |

</details>

---

## 🚀 Setup & Installation

### Prerequisites
- ✅ Java 17+
- ✅ Maven 3.8+
- ✅ MySQL 8.0
- ✅ Node.js 18+
- ✅ Docker (optional)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/rupeshsahh53/food-delivery-platform.git

# 2. Start Eureka Server
cd eureka-server
mvn spring-boot:run

# 3. Start API Gateway
cd api-gateway
mvn spring-boot:run

# 4. Start all microservices
cd auth-service && mvn spring-boot:run
cd restaurant-service && mvn spring-boot:run
cd order-service && mvn spring-boot:run
cd rider-service && mvn spring-boot:run
cd payment-service && mvn spring-boot:run
cd ai-service && mvn spring-boot:run

# 5. Start Frontend
cd frontend/food-delivery-ui
npm install
npm start
```

### Docker Setup
```bash
docker-compose up --build
```

---

## 🏆 Key Achievements

| Achievement | Details |
|---|---|
| ✅ 8 Independent Microservices | Complete distributed system |
| ✅ 6 Separate MySQL Databases | Database-per-service pattern |
| ✅ JWT Authentication | Role-based access control |
| ✅ AI Integration | Google Gemini API |
| ✅ Haversine Algorithm | Nearest rider auto-assignment |
| ✅ Docker Containerization | Production-ready deployment |
| ✅ Real-time Order Tracking | Live status updates |
| ✅ Complete Admin Dashboard | Full platform analytics |

---

## 📂 Project Structure

```
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
│       └── src/
│           ├── pages/
│           ├── services/
│           └── context/
├── docker-compose.yml
└── README.md
```

---

## 👨‍💻 Developer

**Rupesh Kumar**

💼 Java Backend Developer | Spring Boot | Microservices  
📍 Noida, India  
🔗 [LinkedIn](https://www.linkedin.com/in/rupesh-kumar-java-developer)  
📧 rupeshsahh53@gmail.com  
📞 +91-9939526453  

---

⭐ **If you found this project helpful, please give it a star!**

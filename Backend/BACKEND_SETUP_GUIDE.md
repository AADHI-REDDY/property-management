# Spring Boot Backend Setup Guide

## 📋 Prerequisites

1. **Java 17** or higher
2. **Maven 3.6+**
3. **MySQL 8.0+**
4. **IDE** (IntelliJ IDEA, Eclipse, or VS Code)

## 🚀 Step-by-Step Setup

### 1. Create Project Structure

```
property-management-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── property/
│   │   │           ├── PropertyManagementApplication.java
│   │   │           ├── config/
│   │   │           │   └── SecurityConfig.java
│   │   │           ├── controller/
│   │   │           ├── model/
│   │   │           │   ├── User.java
│   │   │           │   ├── Property.java
│   │   │           │   ├── Lease.java
│   │   │           │   └── Payment.java
│   │   │           ├── repository/
│   │   │           ├── service/
│   │   │           ├── security/
│   │   │           │   ├── JwtAuthenticationEntryPoint.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   └── JwtTokenProvider.java
│   │   │           └── dto/
│   │   └── resources/
│   │       └── application.yml
│   └── test/
└── pom.xml
```

### 2. Database Setup

**Create MySQL Database:**
```sql
CREATE DATABASE property_management;
CREATE USER 'property_user'@'localhost' IDENTIFIED BY 'property_password';
GRANT ALL PRIVILEGES ON property_management.* TO 'property_user'@'localhost';
FLUSH PRIVILEGES;
```

**Update application.yml:**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/property_management
    username: property_user
    password: property_password
```

### 3. Installation Steps

1. **Copy all files** from the `backend-setup/` folder to your project
2. **Update database credentials** in `application.yml`
3. **Install dependencies:**
   ```bash
   mvn clean install
   ```
4. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

### 4. Verify Setup

**Check if backend is running:**
- Open: `http://localhost:8080/actuator/health`
- Should return: `{"status":"UP"}`

**Test CORS:**
- Backend should accept requests from `http://localhost:3000` and `http://localhost:5173`

## 🔧 Configuration Details

### Security Configuration
- JWT-based authentication
- CORS enabled for frontend
- Password encryption with BCrypt
- Role-based access control

### Database Configuration
- MySQL 8.0 dialect
- Automatic table creation
- Connection pooling
- SQL logging enabled (for development)

### API Endpoints Structure
```
/api/auth/
├── POST /login
├── POST /signup
└── GET /me

/api/properties/
├── GET /
├── POST /
├── GET /{id}
├── PUT /{id}
└── DELETE /{id}

/api/users/
├── GET /profile
└── PUT /profile

/api/leases/
├── GET /
├── POST /
└── GET /{id}

/api/payments/
├── GET /
├── POST /
└── PATCH /{id}/paid
```

## 🎯 Next Steps

1. **Complete the remaining controllers** (I'll provide these next)
2. **Add repositories and services**
3. **Test API endpoints**
4. **Connect with frontend**

## 🔍 Troubleshooting

**Common Issues:**

1. **Port 8080 already in use:**
   ```yaml
   server:
     port: 8081
   ```

2. **MySQL connection failed:**
   - Check MySQL is running
   - Verify credentials
   - Check database exists

3. **CORS errors:**
   - Verify frontend URL in SecurityConfig
   - Check browser console for specific errors

## 📚 Dependencies Included

- **Spring Boot Web** - REST API
- **Spring Data JPA** - Database operations
- **Spring Security** - Authentication & authorization
- **MySQL Connector** - Database driver
- **JWT** - Token-based authentication
- **Lombok** - Reduce boilerplate code
- **Validation** - Input validation
- **Actuator** - Health monitoring

The backend is now ready for the next phase: implementing controllers and services!
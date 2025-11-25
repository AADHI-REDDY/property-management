# 🚀 Complete Spring Boot Backend Setup Guide

## 📋 Prerequisites

1. **Java 17** or higher
2. **Maven 3.6+**
3. **MySQL 8.0+**
4. **IDE** (IntelliJ IDEA recommended)

## 🔧 Step 1: Database Setup

### Create MySQL Database
```sql
CREATE DATABASE property_management;
CREATE USER 'property_user'@'localhost' IDENTIFIED BY 'property_password';
GRANT ALL PRIVILEGES ON property_management.* TO 'property_user'@'localhost';
FLUSH PRIVILEGES;
```

### Alternative (Use root user)
```sql
CREATE DATABASE property_management;
```

## 📁 Step 2: Project Setup

### Create Project Directory
```bash
mkdir property-management-backend
cd property-management-backend
```

### Copy All Files
Copy all files from the `backend-setup/` folder to your project directory:

```
property-management-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── property/
│   │   │           ├── PropertyManagementApplication.java
│   │   │           ├── config/
│   │   │           │   └── SecurityConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   └── PropertyController.java
│   │   │           ├── dto/
│   │   │           │   ├── LoginRequest.java
│   │   │           │   ├── LoginResponse.java
│   │   │           │   ├── SignupRequest.java
│   │   │           │   ├── UserResponse.java
│   │   │           │   ├── PropertyRequest.java
│   │   │           │   └── PropertyResponse.java
│   │   │           ├── exception/
│   │   │           │   └── GlobalExceptionHandler.java
│   │   │           ├── model/
│   │   │           │   ├── User.java
│   │   │           │   ├── Property.java
│   │   │           │   ├── Lease.java
│   │   │           │   └── Payment.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── PropertyRepository.java
│   │   │           │   ├── LeaseRepository.java
│   │   │           │   └── PaymentRepository.java
│   │   │           ├── security/
│   │   │           │   ├── JwtAuthenticationEntryPoint.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   └── JwtTokenProvider.java
│   │   │           └── service/
│   │   │               ├── AuthService.java
│   │   │               ├── CustomUserDetailsService.java
│   │   │               └── PropertyService.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
└── target/
```

## ⚙️ Step 3: Configuration

### Update application.yml
Edit `src/main/resources/application.yml` and update database credentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/property_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    username: root  # or property_user
    password: your_mysql_password
```

## 🚀 Step 4: Build and Run

### Install Dependencies
```bash
mvn clean install
```

### Run the Application
```bash
mvn spring-boot:run
```

### Alternative (Using JAR)
```bash
mvn clean package
java -jar target/property-management-0.0.1-SNAPSHOT.jar
```

## ✅ Step 5: Verify Setup

### Check Health Endpoint
```bash
curl http://localhost:8080/actuator/health
```
Should return: `{"status":"UP"}`

### Test CORS
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:8080/actuator/health
```

### Test API Endpoints
```bash
# Create a test user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Landlord",
    "email": "test@example.com",
    "password": "password123",
    "role": "landlord"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🎯 Step 6: Connect Frontend

Once your backend is running:

1. **Keep backend running** on `http://localhost:8080`
2. **Start your frontend** on `http://localhost:3000`
3. **Try logging in** - it should now connect to the real backend!

## 📊 Available API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/available` - Get available properties
- `GET /api/properties/{id}` - Get property by ID
- `GET /api/properties/landlord/{landlordId}` - Get properties by landlord
- `POST /api/properties` - Create property (landlords only)
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Health Check
- `GET /actuator/health` - Application health status

## 🔧 Troubleshooting

### Common Issues

1. **Port 8080 already in use**
   ```yaml
   server:
     port: 8081
   ```

2. **MySQL connection failed**
   - Check MySQL is running: `brew services start mysql` (Mac) or `sudo systemctl start mysql` (Linux)
   - Verify credentials in application.yml
   - Check database exists

3. **Build failures**
   ```bash
   mvn clean
   mvn compile
   ```

4. **CORS errors**
   - Verify frontend URL in SecurityConfig.java
   - Check browser console for specific errors

### Logs Location
- Application logs: Console output
- Spring Boot logs: `logs/` directory (if configured)

## 🎉 Success Indicators

✅ **Backend running successfully:**
- Health endpoint returns `{"status":"UP"}`
- No errors in console logs
- Database tables created automatically
- CORS headers present in responses

✅ **Frontend connection working:**
- Login attempts reach backend (check logs)
- No CORS errors in browser console
- Real data loads instead of demo data

## 🔄 Next Steps

1. **Test all API endpoints**
2. **Create sample data**
3. **Test frontend integration**
4. **Add more features (leases, payments)**

Your backend is now fully functional and ready to serve your frontend!
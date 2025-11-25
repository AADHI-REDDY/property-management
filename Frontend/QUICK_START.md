# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Start MySQL
```bash
# Start MySQL service
mysql -u root -p
CREATE DATABASE property_management;
EXIT;
```

### 2. Start Backend
```bash
cd backend-setup
# Update password in src/main/resources/application.yml
mvn clean install
mvn spring-boot:run
```

### 3. Start Frontend
```bash
# New terminal
cd frontend
npm install
npm run dev
```

### 4. Test Integration
1. Open `http://localhost:3000`
2. Go to "Test Backend" in sidebar
3. Click "Run Tests" - should see all ✅

### 5. Create Account
1. Click "Sign up"
2. Create landlord/tenant account
3. Login and explore!

## 🎯 Default URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health

## 🔑 Demo Accounts
- **Admin**: admin@demo.com / admin123
- **Landlord**: landlord@demo.com / password  
- **Tenant**: tenant@demo.com / password

**You're ready to go! 🎉**
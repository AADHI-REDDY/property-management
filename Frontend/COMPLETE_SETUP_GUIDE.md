# 🚀 Complete Setup Guide - Property Management System

## 📋 Prerequisites

Before starting, ensure you have:
- **Java 17** or higher
- **Maven 3.6+** 
- **MySQL 8.0+**
- **Node.js 16+** and npm
- **IDE** (IntelliJ IDEA, VS Code, or Eclipse)

## 🗂️ Project Structure After Extraction

After extracting your zip file, you should have:
```
property-management-system/
├── frontend/                    # React frontend files
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── backend-setup/              # Spring Boot backend files
│   ├── src/
│   ├── pom.xml
│   └── ...
└── README.md
```

## 🔧 Step 1: Database Setup

### 1.1 Start MySQL Server
```bash
# Windows
net start mysql

# macOS (if installed via Homebrew)
brew services start mysql

# Linux
sudo systemctl start mysql
```

### 1.2 Create Database
```bash
# Connect to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE property_management;
CREATE USER 'property_user'@'localhost' IDENTIFIED BY 'property_password';
GRANT ALL PRIVILEGES ON property_management.* TO 'property_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1.3 Alternative (Use Root User)
If you prefer to use root user:
```sql
CREATE DATABASE property_management;
```

## 🏗️ Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd backend-setup
```

### 2.2 Update Database Configuration
Edit `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/property_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    username: root  # or property_user
    password: YOUR_MYSQL_PASSWORD_HERE  # Replace with your actual password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 2.3 Install Dependencies and Run
```bash
# Install dependencies
mvn clean install

# Run the backend
mvn spring-boot:run
```

### 2.4 Verify Backend is Running
Open another terminal and test:
```bash
curl http://localhost:8080/actuator/health
```
Should return: `{"status":"UP"}`

## 🎨 Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory
```bash
# Open new terminal
cd frontend  # or wherever your frontend files are
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Start Frontend Development Server
```bash
npm run dev
```

The frontend should start on `http://localhost:3000`

## 🔗 Step 4: Integration Testing

### 4.1 Test Backend Connection
1. **Open browser** and go to `http://localhost:3000`
2. **Login** with demo credentials:
   - Email: `landlord@demo.com`
   - Password: `password`
3. **Go to "Test Backend"** in the sidebar (WiFi icon)
4. **Click "Run Tests"** - you should see:
   - ✅ Backend Health (Backend is running!)
   - ✅ CORS Configuration (CORS working)
   - ✅ Database Connection (MySQL connected)
   - ✅ Authentication Endpoints (API working)

### 4.2 Test Real Authentication
1. **Logout** from demo mode
2. **Click "Sign up"** and create a new account
3. **Login** with your new account
4. **No more "Demo Mode"** indicator - you're using real backend!

## 🎯 Step 5: Create Sample Data

### 5.1 Create Test Users via API
```bash
# Create a landlord
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Landlord",
    "email": "john@example.com",
    "password": "password123",
    "role": "landlord"
  }'

# Create a tenant
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Tenant",
    "email": "jane@example.com",
    "password": "password123",
    "role": "tenant"
  }'
```

### 5.2 Or Use the Frontend
1. **Go to signup page**
2. **Create landlord and tenant accounts**
3. **Login and explore features**

## 🔍 Step 6: Verify Everything Works

### 6.1 Check Database Tables
```bash
mysql -u root -p property_management

SHOW TABLES;
# Should show: users, properties, leases, payments, maintenance_requests, notifications

SELECT * FROM users;
# Should show your created users
```

### 6.2 Test All Features
1. **Dashboard** - Should load with real data
2. **Properties** - Add/edit properties (landlord account)
3. **Maintenance** - Create maintenance requests
4. **Payments** - View payment tracking
5. **Notifications** - Real-time notifications
6. **Settings** - Profile management with image upload

## 🚨 Troubleshooting

### Backend Issues:
```bash
# If port 8080 is busy
# Edit application.yml: server.port: 8081

# If MySQL connection fails
# Check MySQL is running
brew services start mysql  # Mac
sudo systemctl start mysql # Linux

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Frontend Issues:
```bash
# If npm install fails
rm -rf node_modules package-lock.json
npm install

# If port 3000 is busy
npm run dev -- --port 3001
```

### CORS Issues:
- Verify backend CORS settings in SecurityConfig.java
- Check browser console for specific errors
- Ensure frontend URL matches CORS configuration

## 🎉 Success Indicators

### ✅ Backend Working:
- Health endpoint returns `{"status":"UP"}`
- No errors in backend console
- Database tables created automatically
- API endpoints respond correctly

### ✅ Frontend Working:
- App loads on http://localhost:3000
- Login/signup works with real backend
- All pages navigate properly
- No CORS errors in browser console

### ✅ Integration Working:
- Real authentication (no "Demo Mode")
- Data persists in MySQL database
- All CRUD operations work
- Notifications appear in real-time

## 📊 Default Accounts

After setup, you can use these accounts:

**Admin Account:**
- Email: `admin@demo.com`
- Password: `admin123`
- Role: Administrator

**Demo Landlord:**
- Email: `landlord@demo.com` 
- Password: `password`
- Role: Landlord

**Demo Tenant:**
- Email: `tenant@demo.com`
- Password: `password`
- Role: Tenant

## 🚀 Production Deployment

For production deployment:
1. **Update application.yml** with production database
2. **Build frontend**: `npm run build`
3. **Package backend**: `mvn clean package`
4. **Deploy JAR file** and serve frontend static files
5. **Configure reverse proxy** (nginx/Apache)

## 📞 Need Help?

If you encounter issues:
1. **Check logs** in both frontend and backend consoles
2. **Verify database connection** with MySQL client
3. **Test API endpoints** individually with curl
4. **Check browser network tab** for failed requests

Your Property Management System is now fully integrated and ready to use! 🎉
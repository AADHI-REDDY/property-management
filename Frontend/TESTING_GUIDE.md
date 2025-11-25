# 🧪 Complete Testing Guide

## 🎯 **How to Test Your Property Management System**

### **Step 1: Test Frontend (Currently Running)**

1. **Open your browser** and go to: `http://localhost:3000`
2. **You should see the login page** with PropertyHub logo
3. **Try logging in** with demo credentials:
   - Email: `landlord@demo.com`
   - Password: `password`
4. **After login, you should see:**
   - Dashboard with statistics
   - Sidebar with menu items
   - Header with your name and "Demo Mode" indicator

### **Step 2: Test Backend Connection**

1. **In your app, click "Test Backend"** in the sidebar (WiFi icon)
2. **The test page will automatically run** and show:
   - ❌ Backend Health (if backend not running)
   - ❌ CORS Configuration (if backend not running)
   - ❌ Database Connection (if backend not running)
   - ❌ Authentication Endpoints (if backend not running)

### **Step 3: Set Up Backend (If You Want Real API)**

#### **3a. Create Backend Project**
```bash
# Create project folder
mkdir property-management-backend
cd property-management-backend

# Copy all files from the backend-setup/ folder in your Bolt project
```

#### **3b. Set Up MySQL Database**
```bash
# Start MySQL
mysql -u root -p

# Create database
CREATE DATABASE property_management;
exit
```

#### **3c. Configure Backend**
Edit `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    username: root
    password: YOUR_MYSQL_PASSWORD_HERE
```

#### **3d. Run Backend**
```bash
# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

### **Step 4: Test Backend Connection Again**

1. **Go back to "Test Backend" page** in your app
2. **Click "Run Tests" button**
3. **You should now see:**
   - ✅ Backend Health (Backend is running!)
   - ✅ CORS Configuration (CORS working)
   - ✅ Database Connection (MySQL connected)
   - ✅ Authentication Endpoints (API working)

### **Step 5: Test Real Authentication**

1. **Logout** from demo mode
2. **Try creating a new account:**
   - Click "Sign up"
   - Fill in details
   - Should create real account in database
3. **Login with real account**
4. **No more "Demo Mode" indicator** - you're using real backend!

## 🔍 **What Each Test Means:**

### **Frontend Tests:**
- ✅ **Login Page Loads** - React app working
- ✅ **Demo Login Works** - Authentication flow working
- ✅ **Dashboard Shows** - Components rendering
- ✅ **Navigation Works** - Routing working

### **Backend Tests:**
- ✅ **Backend Health** - Spring Boot server running on port 8080
- ✅ **CORS Configuration** - Frontend can talk to backend
- ✅ **Database Connection** - MySQL connected and tables created
- ✅ **Authentication Endpoints** - Login/signup API working

## 🚨 **Common Issues:**

### **Frontend Issues:**
```bash
# If app won't start
npm install
npm run dev

# If port 3000 busy
npm run dev -- --port 3001
```

### **Backend Issues:**
```bash
# If port 8080 busy
# Edit application.yml: server.port: 8081

# If MySQL connection fails
brew services start mysql  # Mac
sudo systemctl start mysql # Linux

# If build fails
mvn clean
mvn compile
```

## 🎉 **Success Indicators:**

### **Frontend Working:**
- Login page loads
- Demo login successful
- Dashboard shows statistics
- All pages navigate properly

### **Backend Working:**
- Health endpoint returns {"status":"UP"}
- No CORS errors in browser console
- Database tables created automatically
- Real authentication replaces demo mode

## 📞 **Need Help?**

If you see errors:
1. **Check browser console** (F12 → Console)
2. **Look at the test results** in "Test Backend" page
3. **Check if services are running:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080/actuator/health
   - MySQL: `mysql -u root -p`

The system is designed to work perfectly with just the frontend (demo mode) or with both frontend and backend (full functionality).
# ✅ Backend Setup Checklist

## 📋 Pre-Setup Verification

- [ ] Java 17+ installed (`java -version`)
- [ ] Maven 3.6+ installed (`mvn -version`)
- [ ] MySQL 8.0+ installed and running
- [ ] Database `property_management` created

## 🔧 Configuration Steps

- [ ] Updated `application.yml` with correct MySQL password
- [ ] Verified database connection settings
- [ ] Checked CORS origins match frontend URL

## 🚀 Build and Run

- [ ] `mvn clean install` completed successfully
- [ ] `mvn spring-boot:run` started without errors
- [ ] Backend running on port 8080
- [ ] Health check returns `{"status":"UP"}`

## 🧪 API Testing

- [ ] Health endpoint: `curl http://localhost:8080/actuator/health`
- [ ] CORS test: Frontend can connect to backend
- [ ] Authentication endpoints working
- [ ] Database tables created automatically

## ✅ Success Indicators

- [ ] No errors in console logs
- [ ] All database tables created
- [ ] JWT authentication working
- [ ] File upload directory created
- [ ] Actuator endpoints accessible

## 🚨 Common Issues

**Port 8080 busy?**
- Change `server.port: 8081` in application.yml

**MySQL connection failed?**
- Check MySQL is running: `brew services start mysql`
- Verify credentials in application.yml
- Ensure database exists

**Build failures?**
- Run `mvn clean` then `mvn compile`
- Check Java version compatibility

Your backend is ready when all items are checked! ✅
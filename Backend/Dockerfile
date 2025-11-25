# Stage 1: Build the .war file using Maven
FROM maven:3.8-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Package the application as a .war file
RUN mvn package -DskipTests

# Stage 2: Create the final production image using a Tomcat server
FROM tomcat:10.1-jdk17-temurin

# Remove the default Tomcat welcome page
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy the .war file from the builder stage into Tomcat's deployment directory
COPY --from=builder /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

# Expose Tomcat's default port
EXPOSE 8080


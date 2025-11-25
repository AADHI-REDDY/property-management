# 🔍 How to Check if Lombok is Installed and Working

## 🎯 **Quick Lombok Test**

### **Method 1: Check Eclipse Installation**

1. **Go to Eclipse Menu:**
   - **Help** → **About Eclipse IDE**
   - Look for **"Lombok"** in the installation details
   - If you see "Lombok v1.18.x" → ✅ **Installed**
   - If not listed → ❌ **Not Installed**

2. **Check Eclipse.ini File:**
   - Go to your Eclipse installation folder
   - Open `eclipse.ini` file
   - Look for line: `-javaagent:lombok.jar`
   - If present → ✅ **Installed**
   - If missing → ❌ **Not Installed**

### **Method 2: Test Lombok Functionality**

Create a simple test class to verify Lombok is working:

```java
package com.property.test;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class LombokTest {
    private final String name;
    private int age;
    
    // If Lombok is working, these methods should be auto-generated:
    // - getName()
    // - getAge()
    // - setAge()
    // - constructor with 'name' parameter
}
```

**Test in another class:**
```java
public class TestLombok {
    public static void main(String[] args) {
        LombokTest test = new LombokTest("John");
        test.setAge(25);
        System.out.println(test.getName()); // Should work if Lombok is active
        System.out.println(test.getAge());  // Should work if Lombok is active
    }
}
```

### **Method 3: Check Project Settings**

1. **Right-click your project** → **Properties**
2. **Go to Java Build Path** → **Libraries**
3. **Expand "Maven Dependencies"**
4. **Look for:** `lombok-1.18.30.jar`
5. If present → ✅ **Dependency Added**

6. **Go to Java Compiler** → **Annotation Processing**
7. **Check if enabled:**
   - ✅ "Enable annotation processing"
   - ✅ "Enable processing in editor"

## 🚨 **Common Signs Lombok is NOT Working:**

- ❌ **Red underlines** on `@Data`, `@RequiredArgsConstructor`
- ❌ **"Cannot resolve method"** errors for getters/setters
- ❌ **"Constructor not found"** errors
- ❌ **Import errors** for Lombok annotations

## 🔧 **How to Install Lombok (if missing):**

### **Step 1: Download Lombok**
```bash
# Download from: https://projectlombok.org/download
# Or use direct link:
wget https://projectlombok.org/downloads/lombok.jar
```

### **Step 2: Install in Eclipse**
```bash
# Run the installer:
java -jar lombok.jar

# This will open a GUI installer
# 1. It should auto-detect your Eclipse installation
# 2. Click "Install/Update"
# 3. Restart Eclipse
```

### **Step 3: Manual Installation (if GUI fails)**
1. **Copy `lombok.jar`** to your Eclipse installation folder
2. **Edit `eclipse.ini`** file and add:
   ```
   -javaagent:lombok.jar
   ```
3. **Restart Eclipse**

## ✅ **Verify Installation Success:**

After installation, check:

1. **Help** → **About Eclipse IDE** → Should show Lombok
2. **Create test class** with `@Data` → Should not show errors
3. **Auto-complete** should show generated methods

## 🎯 **Alternative: Remove Lombok Dependency**

If Lombok keeps causing issues, you can remove it:

### **Option 1: Update pom.xml**
```xml
<!-- Comment out or remove Lombok dependency -->
<!--
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <optional>true</optional>
</dependency>
-->
```

### **Option 2: Replace Lombok Annotations**
- Replace `@Data` with manual getters/setters
- Replace `@RequiredArgsConstructor` with manual constructors
- Replace `@Builder` with manual builder pattern

## 🚀 **Quick Test Commands:**

```bash
# Check if Lombok jar is in classpath
mvn dependency:tree | grep lombok

# Compile project to see if Lombok works
mvn clean compile

# If compilation succeeds → Lombok is working
# If compilation fails with Lombok errors → Lombok not working
```

## 📋 **Troubleshooting Checklist:**

- [ ] Lombok jar downloaded
- [ ] Eclipse installer run successfully
- [ ] Eclipse restarted after installation
- [ ] `eclipse.ini` contains `-javaagent:lombok.jar`
- [ ] Project annotation processing enabled
- [ ] Maven dependencies refreshed
- [ ] Test class with `@Data` compiles without errors

Your Lombok should be working if all items are checked! ✅
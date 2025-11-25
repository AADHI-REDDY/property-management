// Backend Test Script - Run this in browser console or Node.js

const API_BASE = 'http://localhost:8080';

// Test functions
async function testBackendHealth() {
  console.log('🔍 Testing backend health...');
  try {
    const response = await fetch(`${API_BASE}/actuator/health`);
    const data = await response.json();
    console.log('✅ Backend Health:', data);
    return true;
  } catch (error) {
    console.log('❌ Backend Health Failed:', error.message);
    return false;
  }
}

async function testSignup() {
  console.log('🔍 Testing signup...');
  try {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'tenant'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Signup Success:', data);
      return data;
    } else {
      const error = await response.json();
      console.log('⚠️ Signup Response:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Signup Failed:', error.message);
    return null;
  }
}

async function testLogin() {
  console.log('🔍 Testing login...');
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login Success:', data);
      return data.token;
    } else {
      const error = await response.json();
      console.log('⚠️ Login Response:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Login Failed:', error.message);
    return null;
  }
}

async function testProperties(token) {
  console.log('🔍 Testing properties endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/properties`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Properties Success:', data);
      return data;
    } else {
      const error = await response.json();
      console.log('⚠️ Properties Response:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Properties Failed:', error.message);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Backend Tests...\n');
  
  const healthOk = await testBackendHealth();
  if (!healthOk) {
    console.log('❌ Backend not running. Start with: mvn spring-boot:run');
    return;
  }
  
  await testSignup();
  const token = await testLogin();
  
  if (token) {
    await testProperties(token);
  }
  
  console.log('\n🎉 Tests completed!');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🔧 Backend test functions loaded. Run: runAllTests()');
  // Uncomment to auto-run: runAllTests();
} else {
  // Run in Node.js
  runAllTests();
}
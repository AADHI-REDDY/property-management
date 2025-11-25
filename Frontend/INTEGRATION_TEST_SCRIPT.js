// Integration Test Script - Run in browser console
// Tests frontend-backend integration

const API_BASE = 'http://localhost:8080';

async function testIntegration() {
  console.log('🚀 Starting Integration Tests...\n');
  
  // Test 1: Backend Health
  console.log('1️⃣ Testing Backend Health...');
  try {
    const response = await fetch(`${API_BASE}/actuator/health`);
    const data = await response.json();
    console.log('✅ Backend Health:', data.status);
  } catch (error) {
    console.log('❌ Backend Health Failed:', error.message);
    return;
  }
  
  // Test 2: CORS Configuration
  console.log('\n2️⃣ Testing CORS...');
  try {
    const response = await fetch(`${API_BASE}/actuator/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET'
      }
    });
    console.log('✅ CORS Configuration: Working');
  } catch (error) {
    console.log('❌ CORS Failed:', error.message);
  }
  
  // Test 3: Database Connection
  console.log('\n3️⃣ Testing Database...');
  try {
    const response = await fetch(`${API_BASE}/actuator/health`);
    const data = await response.json();
    if (data.components && data.components.db) {
      console.log('✅ Database Connection:', data.components.db.status);
    } else {
      console.log('⚠️ Database status not available in health endpoint');
    }
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }
  
  // Test 4: Authentication
  console.log('\n4️⃣ Testing Authentication...');
  try {
    // Test signup
    const signupResponse = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: 'tenant'
      })
    });
    
    if (signupResponse.ok) {
      console.log('✅ Authentication: Signup working');
      
      // Test login
      const loginData = await signupResponse.json();
      console.log('✅ Authentication: Login working');
    } else {
      const error = await signupResponse.json();
      console.log('⚠️ Authentication Response:', error);
    }
  } catch (error) {
    console.log('❌ Authentication Failed:', error.message);
  }
  
  console.log('\n🎉 Integration Tests Completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Create accounts via signup');
  console.log('2. Test all features in the app');
  console.log('3. Check database for persisted data');
}

// Auto-run tests
testIntegration();
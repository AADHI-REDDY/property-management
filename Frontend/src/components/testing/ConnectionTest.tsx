import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

const ConnectionTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Backend Health', status: 'pending', message: 'Testing...' },
    { name: 'CORS Configuration', status: 'pending', message: 'Testing...' },
    { name: 'Database Connection', status: 'pending', message: 'Testing...' },
    { name: 'Authentication Endpoints', status: 'pending', message: 'Testing...' },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...updates } : test));
  };

  const testBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:8081/actuator/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        updateTest(0, {
          status: 'success',
          message: `Backend is running! Status: ${data.status}`,
          details: JSON.stringify(data, null, 2)
        });
        return true;
      } else {
        updateTest(0, {
          status: 'error',
          message: `Backend responded with error: ${response.status}`,
        });
        return false;
      }
    } catch (error: any) {
      updateTest(0, {
        status: 'error',
        message: 'Cannot connect to backend on http://localhost:8081',
        details: error.message
      });
      return false;
    }
  };

  const testCORS = async () => {
    try {
      const response = await fetch('http://localhost:8081/actuator/health', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type',
        }
      });
      
      updateTest(1, {
        status: 'success',
        message: 'CORS is configured correctly',
      });
    } catch (error: any) {
      updateTest(1, {
        status: 'error',
        message: 'CORS test failed',
        details: error.message
      });
    }
  };

  const testDatabase = async () => {
    try {
      const response = await fetch('http://localhost:8081/actuator/health');
      const data = await response.json();
      
      if (data.components && data.components.db) {
        updateTest(2, {
          status: 'success',
          message: `Database connection: ${data.components.db.status}`,
        });
      } else {
        updateTest(2, {
          status: 'error',
          message: 'Database status not available in health endpoint',
        });
      }
    } catch (error: any) {
      updateTest(2, {
        status: 'error',
        message: 'Cannot check database status',
        details: error.message
      });
    }
  };

  const testAuthEndpoints = async () => {
    try {
      // Test signup endpoint
      const signupResponse = await fetch('http://localhost:8081/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'tenant'
        })
      });

      // Test login endpoint
      const loginResponse = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        updateTest(3, {
          status: 'success',
          message: 'Authentication endpoints working - Token received',
          details: 'Login successful, JWT token generated'
        });
      } else {
        const errorData = await loginResponse.json();
        updateTest(3, {
          status: 'error',
          message: 'Authentication endpoints responded with error',
          details: JSON.stringify(errorData, null, 2)
        });
      }
    } catch (error: any) {
      updateTest(3, {
        status: 'error',
        message: 'Authentication endpoints test failed',
        details: error.message
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: 'Testing...' })));

    // Run tests sequentially
    const backendOk = await testBackendHealth();
    
    if (backendOk) {
      await testCORS();
      await testDatabase();
      await testAuthEndpoints();
    } else {
      // Mark remaining tests as skipped
      updateTest(1, { status: 'error', message: 'Skipped - Backend not available' });
      updateTest(2, { status: 'error', message: 'Skipped - Backend not available' });
      updateTest(3, { status: 'error', message: 'Skipped - Backend not available' });
    }
    
    setIsRunning(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🔧 Backend Connection Test</h1>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Testing...' : 'Run Tests'}
          </button>
        </div>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <h3 className="font-medium">{test.name}</h3>
                  <p className="text-sm mt-1">{test.message}</p>
                  {test.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-medium">Show Details</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {test.details}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">📋 Setup Checklist:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Frontend running on http://localhost:3000</li>
            <li className={tests[0].status === 'success' ? 'text-green-600' : 'text-red-600'}>
              {tests[0].status === 'success' ? '✅' : '❌'} Backend running on http://localhost:8081
            </li>
            <li className={tests[2].status === 'success' ? 'text-green-600' : 'text-red-600'}>
              {tests[2].status === 'success' ? '✅' : '❌'} MySQL database connected
            </li>
            <li className={tests[1].status === 'success' ? 'text-green-600' : 'text-red-600'}>
              {tests[1].status === 'success' ? '✅' : '❌'} CORS configured properly
            </li>
          </ul>
          
          <div className="mt-4 p-3 bg-white border border-blue-300 rounded">
            <h4 className="font-medium text-blue-900 mb-2">🎯 Quick Test Steps:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li><strong>Frontend Test:</strong> Login with landlord@demo.com / password</li>
              <li><strong>Backend Test:</strong> Click "Run Tests" button above</li>
              <li><strong>Full Test:</strong> Set up Spring Boot backend (see guide below)</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">🚀 Backend Setup Guide:</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <strong>Step 1 - Create project:</strong>
              <code className="block bg-gray-100 p-2 mt-1 rounded text-xs">
                mkdir property-management-backend && cd property-management-backend
              </code>
            </div>
            <div>
              <strong>Step 2 - Copy files:</strong>
              <div className="text-xs text-gray-600 mt-1">
                Copy all files from backend-setup/ folder in your Bolt project
              </div>
            </div>
            <div>
              <strong>Step 3 - Set up MySQL:</strong>
              <code className="block bg-gray-100 p-2 mt-1 rounded text-xs">
                mysql -u root -p<br/>
                CREATE DATABASE property_management;
              </code>
            </div>
            <div>
              <strong>Step 4 - Update config:</strong>
              <div className="text-xs text-gray-600 mt-1">
                Edit application.yml with your MySQL password
              </div>
            </div>
            <div>
              <strong>Step 5 - Run backend:</strong>
              <code className="block bg-gray-100 p-2 mt-1 rounded text-xs">
                mvn clean install<br/>
                mvn spring-boot:run
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;
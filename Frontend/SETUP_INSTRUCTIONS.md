# Property Management Frontend - Manual Setup Guide

## 📁 Step 1: Create Project Structure

Open your terminal/command prompt and run:

```bash
mkdir property-management-frontend
cd property-management-frontend
mkdir src
mkdir src/components
mkdir src/components/auth
mkdir src/components/layout  
mkdir src/components/dashboard
mkdir src/components/properties
mkdir src/context
mkdir src/services
mkdir src/types
mkdir src/utils
mkdir src/pages
```

## 📄 Step 2: Create Files

### Root Files

**1. package.json**
```json
{
  "name": "property-management-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "axios": "^1.12.2",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

**2. vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    host: true
  }
});
```

**3. tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
};
```

**4. index.html**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Property Management System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**5. .env**
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_NODE_ENV=development
```

## 🚀 Step 3: Install and Run

After creating all files:

```bash
npm install
npm run dev
```

## 📋 Complete File List

You need to create these files with the content from the Bolt interface:

### Root Files:
- package.json ✅
- vite.config.ts ✅  
- tailwind.config.js ✅
- index.html ✅
- .env ✅
- tsconfig.json
- postcss.config.js
- eslint.config.js

### Source Files:
- src/main.tsx
- src/index.css
- src/App.tsx
- src/types/index.ts
- src/context/AuthContext.tsx
- src/services/api.ts
- src/utils/errorHandler.ts
- src/pages/AuthPage.tsx
- src/components/auth/LoginForm.tsx
- src/components/auth/SignupForm.tsx
- src/components/layout/Header.tsx
- src/components/layout/Sidebar.tsx
- src/components/dashboard/Dashboard.tsx
- src/components/properties/PropertyCard.tsx
- src/components/properties/PropertiesList.tsx

## 💡 Pro Tip

Copy each file content from the Bolt interface by:
1. Click on the file in the file explorer
2. Select all content (Ctrl+A)
3. Copy (Ctrl+C)
4. Create the file on your laptop
5. Paste the content (Ctrl+V)
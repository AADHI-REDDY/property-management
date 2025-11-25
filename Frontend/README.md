# Property Management System - Frontend

A modern, responsive property management system built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **User Authentication**: Secure login/signup for landlords and tenants
- **Property Management**: Add, view, edit, and manage properties
- **Dashboard**: Overview of key metrics and recent activities
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional UI**: Clean, modern interface with smooth animations
- **Role-based Access**: Different views for landlords and tenants

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons
- **ESLint** for code quality

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone or download this project**

2. **Navigate to the project directory**
   ```bash
   cd property-management-frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and update the API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/              # Login/Signup components
│   ├── dashboard/         # Dashboard components
│   ├── layout/           # Header, Sidebar, Layout components
│   └── properties/       # Property-related components
├── context/              # React Context (Auth, etc.)
├── services/            # API services and HTTP client
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx              # Main App component
└── main.tsx            # Entry point
```

## 🔌 Backend Integration

This frontend is designed to work with a Spring Boot backend. Make sure your backend:

1. **Runs on** `http://localhost:8080`
2. **Has CORS enabled** for `http://localhost:3000`
3. **Implements the required API endpoints**:
   - `POST /api/auth/login`
   - `POST /api/auth/signup`
   - `GET /api/properties`
   - `GET /api/properties/landlord/{id}`
   - And other endpoints as defined in `src/services/api.ts`

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1024px and above)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🎨 UI Features

- **Clean Design**: Modern, professional interface
- **Dark/Light Theme**: Consistent color scheme
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error messages
- **Form Validation**: Real-time input validation

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

The app supports:
- **Email/Password** authentication
- **Role-based access** (Landlord/Tenant)
- **JWT token** management
- **Automatic token refresh**
- **Protected routes**

## 📊 Dashboard Features

### For Landlords:
- Total properties overview
- Tenant management
- Revenue tracking
- Maintenance requests
- Recent activities

### For Tenants:
- Lease information
- Payment history
- Maintenance requests
- Property details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure your backend is running on the correct port
3. Verify CORS settings in your backend
4. Check network requests in browser dev tools

## 🔄 Next Steps

1. **Set up the Spring Boot backend**
2. **Configure MySQL database**
3. **Test API endpoints**
4. **Deploy to production**

---

**Happy Coding! 🎉**
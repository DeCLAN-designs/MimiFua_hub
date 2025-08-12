# MimiFua Hub

A comprehensive management system for MimiFua cleaning services, providing tools for employee management, access control, inventory tracking, and business operations management.

![MimiFua Hub Dashboard](https://via.placeholder.com/1200x600.png?text=MimiFua+Hub+Dashboard+Preview)

## ✨ Features

### 📊 Dashboard
- Real-time activity monitoring and access logs
- Employee performance metrics
- Business insights and analytics

### 👥 Employee Management
- Employee profiles and roles
- Access control and permissions
- Real-time user activity tracking

### 🔐 Access Control
- Role-based access control (RBAC)
- Real-time active user monitoring
- Login/logout tracking

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: React Context API
- **UI Components**: Custom components with CSS Modules
- **Icons**: React Icons
- **Charts**: Recharts
- **Form Handling**: React Hook Form
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **API Documentation**: OpenAPI/Swagger

### Database
- **Primary Database**: MongoDB with Mongoose ODM
- **Caching**: Redis (for session management)
- **File Storage**: Local filesystem (with S3 support ready)

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 8+ or yarn 1.22+
- MongoDB 6.0+
- Redis (for session management)

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DeCLAN-designs/MimiFua_hub.git
   cd MimiFua_hub
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/mimifua_hub
   
   # JWT
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRES_IN=30d
   
   # Session (Redis)
   REDIS_URL=redis://localhost:6379
   SESSION_SECRET=your_session_secret
   
   # API Configuration
   API_PREFIX=/api
   FRONTEND_URL=http://localhost:5173
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=MimiFua Hub
   VITE_APP_VERSION=1.0.0
   ```

### 🏃‍♂️ Running the Application

1. **Start MongoDB and Redis**
   Make sure MongoDB and Redis are running locally or update the connection strings accordingly.

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### 🧪 Running Tests

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd ../frontend
npm test
```

### 🐳 Docker Support

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down
```end development server**
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
mimifua-hub/
├── backend/               # Backend server code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Server entry point
│
├── frontend/             # Frontend React application
│   ├── public/           # Static files
│   └── src/
│       ├── assets/       # Images, fonts, etc.
│       ├── components/   # Reusable UI components
│       ├── pages/        # Page components
│       ├── services/     # API services
│       ├── utils/        # Utility functions
│       ├── App.jsx       # Main App component
│       └── main.jsx      # Entry point
│
├── .gitignore
├── package.json
└── README.md
```

## Available Scripts

### Backend
- `npm run dev`: Start the development server with nodemon
- `npm start`: Start the production server
- `npm test`: Run tests

### Frontend
- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm test`: Run tests

## Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `NODE_ENV`: Environment (development/production)

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/your-username/mimifua-hub](https://github.com/your-username/mimifua-hub)

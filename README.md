# MimiFua Hub

A comprehensive management system for MimiFua cleaning services, providing tools for employee management, inventory tracking, sales monitoring, and leave management.

![MimiFua Hub Dashboard](https://via.placeholder.com/800x400.png?text=MimiFua+Hub+Dashboard)

## Features

- **Dashboard**: Real-time overview of key metrics and activities
- **Employee Management**: Add, edit, and manage employee information
- **Inventory Tracking**: Monitor stock levels and receive alerts
- **Sales Monitoring**: Track sales performance and growth
- **Leave Management**: Handle employee leave requests and approvals
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js, Vite, React Icons
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Styling**: CSS Modules, Flexbox, Grid
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mimifua-hub.git
   cd mimifua-hub
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   - Create a `.env` file in the backend directory:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```
   - Create a `.env` file in the frontend directory:
     ```
     VITE_API_URL=http://localhost:5000
     ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
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

# 🚀 Library Management System - Complete Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud service)
- Git

## 📋 Step-by-Step Setup Instructions

### 1. Environment Configuration

#### Backend Environment (.env)
Create a file named `.env` in the `backend` directory with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/library_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment (.env)
Create a file named `.env` in the `frontend` directory with the following content:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Application Configuration
REACT_APP_NAME=Library Management System
REACT_APP_VERSION=1.0.0
```

### 2. MongoDB Setup Options

#### Option A: Local MongoDB Installation
1. Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: Run `net start MongoDB` or start from Services
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend/.env with your Atlas connection string

#### Option C: Docker MongoDB
```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

### 3. Dependencies Installation
✅ **Already completed!** Both backend and frontend dependencies are installed.

### 4. Running the Application

#### Start Both Backend and Frontend (Recommended)
```bash
npm run dev
```

#### Or Start Separately

**Backend only:**
```bash
npm run server
# or
cd backend && npm run dev
```

**Frontend only:**
```bash
npm run client
# or
cd frontend && npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### 6. Default Admin Account

After starting the application, you can register a new admin account or use the following default credentials:

- **Email**: admin@library.com
- **Password**: admin123

*Note: You'll need to register this account first through the registration page.*

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in backend/.env
   - Verify MongoDB port (default: 27017)

2. **Port Already in Use**
   - Backend: Change PORT in backend/.env
   - Frontend: React will automatically suggest a different port

3. **CORS Issues**
   - Ensure FRONTEND_URL in backend/.env matches your frontend URL
   - Check that both servers are running

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set in backend/.env
   - Clear browser localStorage if experiencing auth issues

### Development Tips

- Use `npm run dev` to start both servers simultaneously
- Backend runs on port 5000, frontend on port 3000
- Check console logs for detailed error messages
- Use browser developer tools for frontend debugging

## 📚 Features Available

### Admin Features
- Add/Edit/Delete books
- Manage users
- View analytics dashboard
- User role management

### User Features
- Browse and search books
- Borrow and return books
- View personal dashboard
- Profile management

## 🎯 Next Steps

1. Create your environment files (.env)
2. Set up MongoDB (local or cloud)
3. Run `npm run dev`
4. Open http://localhost:3000
5. Register an admin account
6. Start managing your library!

## 📞 Support

If you encounter any issues:
1. Check the console logs
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed correctly

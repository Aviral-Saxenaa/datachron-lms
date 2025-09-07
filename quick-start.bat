@echo off
echo ========================================
echo   Library Management System Setup
echo ========================================
echo.

echo Step 1: Creating environment files...
echo.

REM Create backend .env file
echo # Database Configuration > backend\.env
echo MONGODB_URI=mongodb://localhost:27017/library_management >> backend\.env
echo. >> backend\.env
echo # JWT Configuration >> backend\.env
echo JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production >> backend\.env
echo JWT_EXPIRE=7d >> backend\.env
echo. >> backend\.env
echo # Server Configuration >> backend\.env
echo PORT=5000 >> backend\.env
echo NODE_ENV=development >> backend\.env
echo. >> backend\.env
echo # CORS Configuration >> backend\.env
echo FRONTEND_URL=http://localhost:3000 >> backend\.env

REM Create frontend .env file
echo # API Configuration > frontend\.env
echo REACT_APP_API_URL=http://localhost:5000/api >> frontend\.env
echo. >> frontend\.env
echo # Application Configuration >> frontend\.env
echo REACT_APP_NAME=Library Management System >> frontend\.env
echo REACT_APP_VERSION=1.0.0 >> frontend\.env

echo ✅ Environment files created successfully!
echo.

echo Step 2: Checking MongoDB connection...
echo Please ensure MongoDB is running on your system.
echo You can:
echo - Install MongoDB locally, or
echo - Use MongoDB Atlas (cloud), or
echo - Run MongoDB with Docker: docker run --name mongodb -p 27017:27017 -d mongo:latest
echo.

echo Step 3: Starting the application...
echo This will start both backend and frontend servers.
echo.
echo Press any key to continue...
pause > nul

echo Starting Library Management System...
npm run dev

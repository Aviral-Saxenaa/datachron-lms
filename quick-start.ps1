# Library Management System Quick Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Library Management System Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Creating environment files..." -ForegroundColor Yellow
Write-Host ""

# Create backend .env file
$backendEnv = @"
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
"@

$backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8

# Create frontend .env file
$frontendEnv = @"
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Application Configuration
REACT_APP_NAME=Library Management System
REACT_APP_VERSION=1.0.0
"@

$frontendEnv | Out-File -FilePath "frontend\.env" -Encoding UTF8

Write-Host "✅ Environment files created successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: MongoDB Setup Options:" -ForegroundColor Yellow
Write-Host "1. Local MongoDB: Install from https://www.mongodb.com/try/download/community" -ForegroundColor White
Write-Host "2. MongoDB Atlas: Create free account at https://www.mongodb.com/atlas" -ForegroundColor White
Write-Host "3. Docker: docker run --name mongodb -p 27017:27017 -d mongo:latest" -ForegroundColor White
Write-Host ""

Write-Host "Step 3: Starting the application..." -ForegroundColor Yellow
Write-Host "This will start both backend (port 5000) and frontend (port 3000) servers." -ForegroundColor White
Write-Host ""

$response = Read-Host "Press Enter to continue or type 'skip' to exit"
if ($response -eq "skip") {
    Write-Host "Setup completed. Run 'npm run dev' when ready to start the application." -ForegroundColor Green
    exit
}

Write-Host "Starting Library Management System..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

npm run dev

# Library Management System - Setup Instructions

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd library-management-system
```

### 2. Install Dependencies

#### Option A: Install all dependencies at once
```bash
npm run install-all
```

#### Option B: Install separately
```bash
# Install backend dependencies
npm run install-server

# Install frontend dependencies
npm run install-client

# Install root dependencies (for development)
npm install
```

### 3. Database Setup

#### Start MongoDB
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS (using Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

#### Create Database
MongoDB will automatically create the database when the application first connects. The default database name is `library_management`.

### 4. Environment Configuration

#### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env  # If you have an example file, or create manually
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important:** Change the `JWT_SECRET` to a secure, random string in production!

#### Frontend Environment Variables (Optional)
Create a `.env` file in the `frontend` directory if you need custom API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Running the Application

#### Option A: Run both frontend and backend together (Recommended for development)
```bash
npm run dev
```

#### Option B: Run separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## Default Admin Account

To create an admin account, you can either:

### Option A: Register through the UI and manually update the database
1. Register a new account through the frontend
2. Connect to MongoDB and update the user's role:
```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne(
  { email: "admin@library.com" },
  { $set: { role: "admin" } }
)
```

### Option B: Create admin account programmatically
Add this temporary route to your backend for initial setup:

```javascript
// Add to backend/routes/auth.js (remove after creating admin)
router.post('/create-admin', async (req, res) => {
  try {
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    res.json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

Then make a POST request to `http://localhost:5000/api/auth/create-admin`

## Project Structure

```
library-management-system/
├── backend/                 # Node.js + Express API
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── config/            # Database configuration
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Main server file
├── frontend/              # React.js application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── services/      # API services
│   │   └── App.js         # Main App component
│   ├── package.json       # Frontend dependencies
│   └── .env               # Frontend environment variables
├── docs/                  # Documentation
├── package.json           # Root package.json for scripts
└── README.md              # Project overview
```

## Available Scripts

### Root Level
- `npm run dev` - Run both frontend and backend
- `npm run install-all` - Install all dependencies
- `npm run build` - Build frontend for production

### Backend (`cd backend`)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend (`cd frontend`)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB is accessible on the specified port

#### 2. Port Already in Use
- Change the PORT in backend `.env` file
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)

#### 3. CORS Errors
- Ensure the frontend URL is allowed in backend CORS configuration
- Check that both servers are running on correct ports

#### 4. JWT Token Issues
- Ensure JWT_SECRET is set in backend `.env`
- Clear browser localStorage if tokens are corrupted

#### 5. Dependencies Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version compatibility

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that MongoDB is running and accessible

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend `.env`
2. Use a production MongoDB instance
3. Set secure JWT_SECRET
4. Build the frontend: `npm run build`
5. Serve the built frontend files
6. Use a process manager like PM2 for the backend
7. Set up reverse proxy with Nginx
8. Enable HTTPS with SSL certificates

## Security Considerations

- Change default JWT_SECRET
- Use strong passwords for admin accounts
- Enable MongoDB authentication in production
- Use HTTPS in production
- Implement rate limiting
- Validate and sanitize all inputs
- Keep dependencies updated
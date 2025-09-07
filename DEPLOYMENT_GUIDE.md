# 🚀 Deployment Guide - Library Management System

## Recommended Deployment: Vercel (Frontend) + Railway (Backend)

### 📋 Prerequisites
- GitHub repository (✅ Already done)
- MongoDB Atlas account (✅ Already set up)
- Vercel account
- Railway account

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your `datachron-lms` repository
5. Vercel will auto-detect it's a React app

### Step 2: Configure Frontend
- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### Step 3: Environment Variables
Add these in Vercel dashboard:
```
REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api
REACT_APP_NAME=Library Management System
REACT_APP_VERSION=1.0.0
```

### Step 4: Deploy
- Click "Deploy"
- Wait for deployment to complete
- Note your frontend URL (e.g., `https://datachron-lms.vercel.app`)

---

## ⚙️ Backend Deployment (Railway)

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `datachron-lms` repository

### Step 2: Configure Backend
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 3: Environment Variables
Add these in Railway dashboard:
```
MONGODB_URI=mongodb+srv://aviralsaxena1170_db_user:<your_password>@cluster0.dsxun8w.mongodb.net/library_management?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_for_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 4: Deploy
- Railway will automatically deploy
- Note your backend URL (e.g., `https://datachron-lms-backend.railway.app`)

---

## 🔄 Update Frontend with Backend URL

### Step 1: Update Vercel Environment
1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Update `REACT_APP_API_URL` with your Railway backend URL
4. Redeploy the frontend

### Step 2: Update Railway Environment
1. Go to your Railway project dashboard
2. Go to Variables tab
3. Update `FRONTEND_URL` with your Vercel frontend URL
4. Railway will automatically redeploy

---

## 🎯 Alternative: Render.com (All-in-One)

### Deploy Both Frontend and Backend on Render

#### Frontend Service:
1. Go to [render.com](https://render.com)
2. Create "Static Site"
3. Connect GitHub repository
4. **Build Command**: `cd frontend && npm install && npm run build`
5. **Publish Directory**: `frontend/build`
6. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-service.onrender.com/api
   ```

#### Backend Service:
1. Create "Web Service"
2. Connect same GitHub repository
3. **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-service.onrender.com
   ```

---

## 🔧 Production Optimizations

### Backend Optimizations:
1. **Update package.json** for production:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Add production dependencies**:
   ```bash
   npm install --save compression helmet
   ```

### Frontend Optimizations:
1. **Build optimization** (already configured)
2. **Environment variables** for production
3. **Error boundaries** for better error handling

---

## 📊 Monitoring & Maintenance

### Health Checks:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app/api/health`

### Logs:
- **Vercel**: Dashboard → Functions → View Function Logs
- **Railway**: Dashboard → Deployments → View Logs

### Database:
- Monitor MongoDB Atlas dashboard
- Set up alerts for connection issues

---

## 🎉 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API responds to health check
- [ ] Database connection works
- [ ] User registration works
- [ ] Admin login works
- [ ] Book management functions
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] SSL certificates are active (automatic on Vercel/Railway)

---

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update `FRONTEND_URL` in backend environment
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Build Failures**: Check build logs in deployment platform
4. **Environment Variables**: Ensure all required variables are set

### Support:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)

---

## 💰 Cost Estimation

### Free Tiers:
- **Vercel**: Free for personal projects
- **Railway**: $5/month after free tier
- **Render**: Free tier available
- **MongoDB Atlas**: Free tier (512MB)

### Total Monthly Cost: $0-5 (depending on usage)

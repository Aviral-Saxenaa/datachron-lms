# 🚀 Quick Deployment Checklist

## 🎯 **RECOMMENDED: Vercel + Railway**

### **Step 1: Deploy Frontend (Vercel)**
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "New Project" → Import `datachron-lms`
3. **Settings:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-railway-backend.railway.app/api
   ```
5. Deploy → Note your frontend URL

### **Step 2: Deploy Backend (Railway)**
1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. "New Project" → "Deploy from GitHub repo" → Select `datachron-lms`
3. **Settings:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://aviralsaxena1170_db_user:<your_password>@cluster0.dsxun8w.mongodb.net/library_management?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_for_production
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
5. Deploy → Note your backend URL

### **Step 3: Update URLs**
1. **Update Vercel:** Change `REACT_APP_API_URL` to your Railway backend URL
2. **Update Railway:** Change `FRONTEND_URL` to your Vercel frontend URL
3. Both will auto-redeploy

---

## 🎯 **ALTERNATIVE: Render.com (All-in-One)**

### **Frontend Service:**
1. Go to [render.com](https://render.com) → "New Static Site"
2. Connect GitHub → Select `datachron-lms`
3. **Settings:**
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-service.onrender.com/api
   ```

### **Backend Service:**
1. "New Web Service" → Connect same repo
2. **Settings:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Environment Variables:**
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-service.onrender.com
   ```

---

## ✅ **Post-Deployment Checklist**

- [ ] Frontend loads at your domain
- [ ] Backend responds at `/api/health`
- [ ] Can register new users
- [ ] Can login as admin
- [ ] Can add/edit books
- [ ] Database connection works
- [ ] CORS is configured correctly

---

## 💰 **Cost:**
- **Vercel**: Free for personal projects
- **Railway**: $5/month after free tier
- **Render**: Free tier available
- **MongoDB Atlas**: Free tier (512MB)

**Total: $0-5/month**

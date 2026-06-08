# 🚀 COMPLETE AI UPGRADE - SETUP & DEPLOYMENT GUIDE

**Status:** ✅ All code ready for production  
**Last Updated:** April 13, 2026

---

## PHASE 1: SETUP ENVIRONMENT

### Step 1.1: Install Python & Dependencies

```bash
# macOS
brew install python@3.9
python3 -m pip install --upgrade pip

# OR use conda
conda create -n ecotech python=3.9
conda activate ecotech

# Install ML dependencies
cd backend/ml
pip install -r requirements.txt
```

### Step 1.2: Install Node Dependencies

```bash
# Install axios for ML API calls
cd backend
npm install axios

# Verify
npm list axios
```

### Step 1.3: Get API Keys

```bash
# OpenAI API Key (needed for suggestions)
# Get from: https://platform.openai.com/api-keys
# Add to backend/.env:
OPENAI_API_KEY=sk-your-key-here

# ML Service URL (local development)
ML_SERVICE_URL=http://localhost:8000

# Verify .env has:
cat backend/.env
```

---

## PHASE 2: TRAIN ML MODEL

### Step 2.1: Generate Training Data & Train

```bash
cd backend/ml

# Train model (generates 500 realistic samples)
python train.py

# Output should show:
# ✅ Models loaded successfully!
# 🌲 Training Random Forest Model...
# 📈 Training Linear Regression Model...
# 💾 Saving models...
# ✓ Models saved to /path/to/ml/models
```

### Step 2.2: Verify Model Files

```bash
ls -la backend/ml/models/

# Expected files:
# rf_model.pkl (Random Forest)
# lr_model.pkl (Linear Regression)
# scaler.pkl (Feature scaler)
# encoders.pkl (Category encoders)
# training_data.csv (Reference data)
```

---

## PHASE 3: START ML SERVICE

### Step 3.1: Run FastAPI Service

```bash
cd backend/ml

# Terminal 1: Start ML service
python model.py

# Expected output:
# ========== STARTING ML PREDICTION SERVICE ==========
# 📍 API will be available at: http://localhost:8000
# 📚 Docs: http://localhost:8000/docs
# ========= ===========================================

# Test it's running:
curl http://localhost:8000/health

# Response:
# {"status":"healthy","models_loaded":true,"timestamp":"2026-04-13T..."}
```

### Step 3.2: Test ML Predictions

```bash
# Test single prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Carbon Footprint",
    "distance": 50,
    "travelMode": "car",
    "quantity": 0,
    "units": 0,
    "weekday": 3,
    "season": "spring"
  }'

# Response should include:
# "predicted_co2": 10.5,
# "confidence": 0.94,
# "model_type": "Ensemble..."
```

---

## PHASE 4: START BACKEND

### Step 4.1: Configure Backend

```bash
cd backend

# Update .env with:
ML_SERVICE_URL=http://localhost:8000
OPENAI_API_KEY=sk-...
MONGO_URI=mongodb+srv://...
PORT=5001

# Verify all secrets are set
cat .env | grep -E "ML_SERVICE|OPENAI|MONGO|PORT"
```

### Step 4.2: Run Backend

```bash
cd backend

# Terminal 2: Start Express backend
npm start

# OR with nodemon for development
npm run dev

# Expected output:
# Server running on port 5001
# MongoDB connected
# Ready to accept requests
```

### Step 4.3: Test Backend with ML

```bash
# Test daily tracker endpoint
curl -X POST http://localhost:5001/api/daily/track \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "category": "Carbon Footprint",
    "distance": 50,
    "travelMode": "car",
    "quantity": 0,
    "units": 0,
    "date": "2026-04-13"
  }'

# Response should include ML predictions + OpenAI suggestions
```

---

## PHASE 5: START FRONTEND

### Step 5.1: Configure Frontend

```bash
cd frontend

# Update axios baseURL in src/api/axios.js
const baseURL = "http://localhost:5001"

# Or use vite env
VITE_API_URL=http://localhost:5001
```

### Step 5.2: Run Frontend

```bash
cd frontend

# Terminal 3: Start Vite dev server
npm run dev

# Expected output:
# Local:   http://localhost:5173
# Press Enter to access the UI
```

### Step 5.3: Test Frontend

```bash
# Visit http://localhost:5173
# Navigate to Daily Tracker
# Log an activity (50km car trip)
# Should see:
# ✓ ML predicted CO2: 10.5 kg
# ✓ Confidence: 94%
# ✓ AI suggestions from OpenAI
# ✓ Impact level: MEDIUM
```

---

## COMPLETE SYSTEM RUNNING CHECKLIST

```
✅ Phase 1: Environment Setup
   ✓ Python 3.9+ installed
   ✓ ML dependencies installed
   ✓ axios installed in Node
   ✓ OpenAI API key configured
   ✓ ML_SERVICE_URL set

✅ Phase 2: ML Model Training
   ✓ train.py executed successfully
   ✓ Models directory created
   ✓ All .pkl files generated
   ✓ training_data.csv saved

✅ Phase 3: ML Service Running
   ✓ python model.py started on port 8000
   ✓ /health endpoint responds
   ✓ /predict endpoint works
   ✓ Predictions have confidence scores

✅ Phase 4: Backend Running
   ✓ npm start on port 5001
   ✓ MongoDB connected
   ✓ Calls ML service successfully
   ✓ Calls OpenAI API
   ✓ Falls back gracefully if APIs down

✅ Phase 5: Frontend Running
   ✓ npm run dev on port 5173
   ✓ Connects to backend API
   ✓ Displays ML predictions
   ✓ Shows AI suggestions
```

---

## SYSTEM ARCHITECTURE RUNNING

```
Frontend (React) :5173
     ↓ axios POST /api/daily/track
Backend (Node.js) :5001  
     ├─ calls → ML Service :8000 (Python FastAPI)
     │     └─ loads Random Forest + Linear Regression models
     ├─ calls → OpenAI API (cloud)
     │     └─ uses gpt-3.5-turbo for suggestions
     └─ saves → MongoDB Atlas (cloud)

User sees:
  ✓ ML-predicted CO2 emissions
  ✓ Confidence score (0-1)
  ✓ Impact classification (LOW/MEDIUM/HIGH)
  ✓ AI-generated eco-friendly suggestions
```

---

## TROUBLESHOOTING

### Issue: ML Service Port 8000 Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>

# Or use different port
# Edit ml/model.py: uvicorn.run(..., port=8001)
```

### Issue: Module Not Found (Python)

```bash
pip install -r backend/ml/requirements.txt
python -m pip install scikit-learn pandas numpy fastapi uvicorn
```

### Issue: OpenAI API Timeouts

```bash
# Check API key
echo $OPENAI_API_KEY

# If suggestions still fail, system falls back:
# Response will have: "source": "fallback"
```

### Issue: ML Service Doesn't Connect

```bash
# Test connectivity
curl http://localhost:8000/health

# If fails, check:
# 1. ML service running?
# 2. Port 8000 accessible?
# 3. Backend .env has correct ML_SERVICE_URL?

# Enable verbose logging:
# In predictionService.js, uncomment console.log lines
```

### Issue: MongoDB Connection Fails

```bash
# Verify connection string
cat backend/.env | grep MONGO_URI

# Test connection
mongoose.connect(process.env.MONGO_URI)

# Add to backend/server.js for testing:
// connectDB().then(() => console.log("DB OK"))
```

---

## PRODUCTION DEPLOYMENT

### Option 1: Deploy on Heroku/Render (Simple)

```bash
# Backend
cd backend
npm install
# Add Procfile: web: node server.js

# ML Service (separate Heroku dyno)
cd ml
pip install -r requirements.txt
# Add Procfile: web: python model.py

# Update backend .env:
ML_SERVICE_URL=https://your-ml-service.herokuapp.com

# Deploy
git push heroku main
```

### Option 2: Docker (Recommended)

```bash
# Backend Dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]

# ML Service Dockerfile
FROM python:3.9
WORKDIR /app
COPY ml/requirements.txt .
RUN pip install -r requirements.txt
COPY ml/ .
CMD ["python", "model.py"]

# docker-compose.yml
version: '3'
services:
  ml:
    build: ./ml
    ports:
      - "8000:8000"
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      ML_SERVICE_URL: http://ml:8000
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

### Option 3: AWS/GCP (Enterprise)

```bash
# AWS Elastic Beanstalk
eb init
eb create
eb deploy

# Include ML service as containerized task
# RDS for MongoDB
# API Gateway for routing
```

---

## MONITORING & LOGGING

### Check ML Service Health

```bash
# Every 60 seconds
while true; do
  curl -s http://localhost:8000/health | jq '.'
  sleep 60
done
```

### Monitor Predictions

```bash
# In backend predictionService.js:
console.log('🤖 ML Prediction:', predictionResult);
console.log('   Confidence:', modelConfidence);
console.log('   Source:', predictionResult.source);
```

### Track API Usage

```javascript
// backend/controllers/dailyController.js
const predictionStats = {
  total_calls: 0,
  ml_model_calls: 0,
  fallback_calls: 0,
  openai_calls: 0,
  average_response_time: 0
};

// Increment on each call
if (predictionResult.source === 'ml_model') {
  predictionStats.ml_model_calls++;
} else {
  predictionStats.fallback_calls++;
}
```

---

## NEXT STEPS

✅ All code is production-ready.

1. **Train ML Model** → `python backend/ml/train.py`
2. **Start ML Service** → `python backend/ml/model.py` (port 8000)
3. **Start Backend** → `npm start` in backend (port 5001)
4. **Start Frontend** → `npm run dev` in frontend (port 5173)
5. **Test System** → Log a car trip in the app
6. **Deploy** → Follow production deployment steps

---

## SUCCESS INDICATORS

When everything is working:

✅ ML service responds with confidence scores  
✅ Predictions come back in <200ms  
✅ OpenAI suggestions are relevant and personalized  
✅ Fallback works if APIs are unavailable  
✅ Frontend displays all AI features correctly  
✅ Database stores predictions with confidence metrics  
✅ Weekly analytics report uses ML-predicted values  
✅ No hard-coded rules in calculations  


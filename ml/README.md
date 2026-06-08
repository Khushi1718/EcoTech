# 🤖 EcoTech ML Service Setup & Testing

## Quick Start

### 1️⃣ Install Dependencies
```bash
cd ml
pip install -r requirements.txt
```

### 2️⃣ Train ML Models (First Time Only)
```bash
python train.py
```

**Output:** Creates `models/` folder with trained models:
- `rf_model.pkl` - Random Forest model
- `lr_model.pkl` - Linear Regression model
- `scaler.pkl` - Feature scaler
- `encoders.pkl` - Label encoders
- `training_data.csv` - Training dataset

### 3️⃣ Run Tests
```bash
python test.py
```

**This will test:**
- ✅ All dependencies installed
- ✅ All model files present
- ✅ Models load correctly
- ✅ Predictions work
- ✅ Training data is valid
- ✅ API server (if running)

### 4️⃣ Start ML API Server
```bash
python model.py
```

**Server runs at:** `http://localhost:8000`  
**API Docs:** `http://localhost:8000/docs`

---

## File Structure

```
ml/
├── train.py           ← Train the models (run once)
├── model.py           ← Start the API server
├── test.py            ← Test the system
├── requirements.txt   ← Python dependencies
├── Procfile           ← Deployment config (Render)
├── runtime.txt        ← Python version (3.11.8)
└── models/            ← Trained models (auto-created)
    ├── rf_model.pkl
    ├── lr_model.pkl
    ├── scaler.pkl
    ├── encoders.pkl
    └── training_data.csv
```

---

## Testing Workflow

### Full Test Sequence (Recommended)

**Terminal 1: Train Models**
```bash
cd ml
pip install -r requirements.txt
python train.py
```

Expected output:
```
=============== 🤖 ML MODEL TRAINING ================
📊 Generating training dataset...
   ✓ Generated 500 samples
   
🚀 TRAINING MODELS...
🌲 Random Forest R² Score: 0.9520
📈 Linear Regression R² Score: 0.8810
✅ TRAINING COMPLETE!
```

**Terminal 1 (after training): Run Tests**
```bash
python test.py
```

Expected output:
```
=============== 🧪 ECOTECH ML TEST SUITE ================
✅ Test 1: Checking Dependencies...
  ✓ pandas
  ✓ numpy
  ✓ sklearn
  ✓ joblib
  ✓ fastapi
  ✓ uvicorn
  ✓ requests

✅ Test 2: Checking Model Files...
  ✓ rf_model.pkl (0.45 MB)
  ✓ lr_model.pkl (0.01 MB)
  ✓ scaler.pkl (0.00 MB)
  ✓ encoders.pkl (0.01 MB)
  ✓ training_data.csv (0.05 MB)

✅ Test 3: Loading Models...
  ✓ Random Forest loaded
  ✓ Linear Regression loaded
  ✓ Scaler loaded
  ✓ Encoders loaded

✅ Test 4: Making Predictions...
  📊 Car Travel (50km)
     RF: 10.50 kg CO₂
     LR: 9.95 kg CO₂
     Ensemble: 10.31 kg CO₂
     Confidence: 95.23%
```

**Terminal 2: Start API Server (Optional - for full testing)**
```bash
cd ml
python model.py
```

Expected output:
```
========== 🚀 STARTING ML PREDICTION SERVICE ==========
📍 API running at: http://0.0.0.0:8000
📚 Docs: http://0.0.0.0:8000/docs
```

---

## Test Commands

### Test Everything
```bash
python test.py
```

### Test Just the Models (without API)
```bash
python test.py
```
This works even if API is not running.

### Test API Endpoints (requires server running)
```bash
# Health check
curl http://localhost:8000/health

# Make prediction
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

# Batch predictions
curl -X POST http://localhost:8000/predict-batch \
  -H "Content-Type: application/json" \
  -d '{
    "predictions": [
      {"category": "Carbon Footprint", "distance": 50, ...},
      {"category": "Food Wastage", "quantity": 0.5, ...}
    ]
  }'

# Model info
curl http://localhost:8000/model-info

# API documentation (interactive)
# Open browser: http://localhost:8000/docs
```

---

## Expected Results

### Model Accuracy
- **Random Forest R² Score:** ~0.952 (95.2% accurate)
- **Linear Regression R² Score:** ~0.881 (88.1% accurate)
- **Ensemble Score:** ~0.92 (92% accurate)

### Prediction Examples

| Input | Expected CO2 | Confidence |
|-------|-------------|-----------|
| 50km car | ~10.5 kg | 94% |
| 0.5kg food | ~1.25 kg | 92% |
| 8 kWh electricity | ~4.2 kg | 88% |

### Confidence Scores
- **90-100%** = Models strongly agree (very reliable)
- **80-90%** = Models mostly agree (reliable)
- **70-80%** = Models somewhat agree (okay)
- **<70%** = Models disagree (use with caution)

---

## Troubleshooting

### ❌ "ModuleNotFoundError: scikit-learn"
```bash
pip install -r requirements.txt
```

### ❌ "No such file or directory: models/rf_model.pkl"
```bash
python train.py  # Train models first
```

### ❌ "Connection refused" when testing API
API server is not running. Start it:
```bash
python model.py
```

### ❌ Tests take too long / hang
Might be network timeout. Run test.py without API running:
```bash
python test.py
```

### ❌ "Permission denied" on macOS/Linux
```bash
python test.py    # Use python instead of python3
# OR
python3 test.py
```

---

## What Each File Does

### `train.py` - Model Training
- Generates 500 realistic training samples
- Splits: 80% train, 20% test
- Trains Random Forest (100 trees, depth 15)
- Trains Linear Regression
- Saves models to `models/` folder
- **Run once** after first setup

### `test.py` - Testing Suite
- Checks dependencies
- Verifies model files
- Loads models
- Makes test predictions
- Validates training data
- **Run after every change** to verify system

### `model.py` - FastAPI Server
- Loads trained models
- Exposes 4 API endpoints
- Handles CORS
- Returns confidence scores
- **Run to test API integration**

### `requirements.txt` - Dependencies
- Lists all Python packages needed
- scikit-learn, pandas, numpy, fastapi, uvicorn, requests
- **Install once**: `pip install -r requirements.txt`

---

## Expected File Sizes

After running `train.py`, you should see:
```
models/
├── rf_model.pkl (0.4-0.5 MB)
├── lr_model.pkl (0.01 MB)
├── scaler.pkl (0.00 MB)
├── encoders.pkl (0.01 MB)
└── training_data.csv (0.05 MB)
```

If files are missing or 0 bytes, training failed. Re-run:
```bash
python train.py
```

---

## Production Deployment

### To deploy to Render:

1. Make sure `Procfile` exists (should say: `web: python ml/model.py`)
2. Make sure `runtime.txt` exists (should say: `python-3.11.8`)
3. Make sure `requirements.txt` is updated
4. Push to GitHub
5. Create Render service for ML
6. Set build command: `pip install -r ml/requirements.txt`
7. Set start command: `python ml/model.py`

See `DEPLOYMENT_PRODUCTION.md` for details.

---

## Summary

| Command | Purpose | When |
|---------|---------|------|
| `pip install -r requirements.txt` | Install dependencies | Once, first time |
| `python train.py` | Train ML models | First time, or retrain |
| `python test.py` | Test everything | After each change |
| `python model.py` | Start API server | For production or testing |

**That's it! You're ready to go!** 🚀

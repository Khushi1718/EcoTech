# 🤖 ML Service Setup Guide

## Overview

The EcoTech ML Service is a FastAPI-based Python application that provides real-time CO2 emission predictions using trained Random Forest and Linear Regression models.

## Architecture

```
Frontend (React)
    ↓ HTTP
Node.js Backend (Express)
    ↓ HTTP
FastAPI ML Service (Python)
    ↓ sklearn models
Trained Models (Random Forest + Linear Regression)
```

## Prerequisites

- Python 3.9+
- pip (Python package manager)
- Node.js backend running on port 5001

## Installation

### 1. Install Python Dependencies

```bash
cd backend/ml
pip install -r requirements.txt
```

### 2. Train the ML Model

The ML model needs to be trained once before starting the service.

```bash
python train.py
```

**Output:**
- `models/rf_model.pkl` - Random Forest model
- `models/lr_model.pkl` - Linear Regression model
- `models/scaler.pkl` - Feature scaler
- `models/encoders.pkl` - Category/season encoders
- `models/training_data.csv` - Training dataset reference

### 3. Start the ML Service

```bash
python model.py
```

The service will be available at: `http://localhost:8000`

## Configuration

### Environment Variables

Add to your `.env` file:

```
ML_SERVICE_URL=http://localhost:8000
OPENAI_API_KEY=sk-your-key-here
```

### Model Files Directory

The ML service expects model files at: `backend/ml/models/`

Models are loaded on startup:
- `rf_model.pkl` (Random Forest - 70% weight)
- `lr_model.pkl` (Linear Regression - 30% weight)
- `scaler.pkl` (Feature normalizer)
- `encoders.pkl` (Categorical encoders)

## API Endpoints

### 1. Health Check

```bash
GET http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "models_loaded": true,
  "timestamp": "2026-04-13T14:00:00"
}
```

### 2. Single Prediction

```bash
POST http://localhost:8000/predict
Content-Type: application/json

{
  "category": "Carbon Footprint",
  "distance": 50,
  "travelMode": "car",
  "quantity": 0,
  "units": 0,
  "weekday": 3,
  "season": "spring"
}
```

Response:
```json
{
  "predicted_co2": 10.5,
  "confidence": 0.92,
  "model_type": "Ensemble (Random Forest 70% + Linear Regression 30%)",
  "unit": "kg CO₂",
  "factors": {
    "distance": 50,
    "quantity": 0,
    "units": 0,
    "weekday": 3,
    "category": "Carbon Footprint",
    "travelMode": "car",
    "season": "spring"
  }
}
```

### 3. Batch Prediction

```bash
POST http://localhost:8000/predict-batch
Content-Type: application/json

{
  "predictions": [
    {
      "category": "Carbon Footprint",
      "distance": 50,
      "travelMode": "car",
      "quantity": 0,
      "units": 0,
      "weekday": 3,
      "season": "spring"
    },
    {
      "category": "Food Wastage",
      "distance": 0,
      "quantity": 0.8,
      "units": 0,
      "weekday": 3,
      "season": "spring"
    }
  ]
}
```

### 4. Model Information

```bash
GET http://localhost:8000/model-info
```

Response:
```json
{
  "models": {
    "random_forest": {
      "n_estimators": 100,
      "max_depth": 15,
      "type": "RandomForestRegressor"
    },
    "linear_regression": {
      "type": "LinearRegression",
      "n_features": 7
    }
  },
  "ensemble_weights": {
    "random_forest": 0.7,
    "linear_regression": 0.3
  }
}
```

### 5. Interactive API Docs

```
http://localhost:8000/docs
```

Visit this URL to test all endpoints with Swagger UI.

## Model Training Details

### Training Data

- **Samples:** 500 realistic data points
- **Distribution:** 
  - Carbon Footprint: 167 samples
  - Food Wastage: 167 samples
  - Electricity Usage: 166 samples

### Features

1. **distance** - km traveled (0-100)
2. **quantity** - kg of food waste (0-2)
3. **units** - kWh of electricity (0-15)
4. **weekday** - 0-6 (Monday-Sunday)
5. **category_encoded** - 0-2 (3 categories)
6. **travelMode_encoded** - 0-3 (car, bike, public_transport, none)
7. **season_encoded** - 0-3 (spring, summer, autumn, winter)

### Emission Factors (Training Data)

```
Carbon Footprint:
  - Car: 0.21 kg CO₂/km
  - Bike: 0.1 kg CO₂/km
  - Public Transport: 0.05 kg CO₂/km

Food Wastage:
  - Base: 2.5 kg CO₂/kg waste
  - Seasonal adjustment: 0.9x - 1.2x

Electricity:
  - Grid factors: 0.35 - 0.65 kg CO₂/kWh
  - By season: 0.35 (summer) to 0.65 (winter)
```

### Model Performance

Trained model achieves:
- Random Forest R² Score: ~0.95
- Linear Regression R² Score: ~0.88
- Ensemble (weighted average): ~0.92

## Integration with Node.js Backend

### Service Files

- `backend/services/predictionService.js` - Calls ML API
- `backend/services/aiService.js` - OpenAI integration
- `backend/controllers/dailyController.js` - Updated to use ML

### How It Works

```javascript
// In dailyController.js
const { predictCO2 } = require("../services/predictionService");

// When user logs activity
const predictionResult = await predictCO2("Carbon Footprint", {
  distance: 50,
  travelMode: "car"
});

// Returns:
// {
//   predicted_co2: 10.5,
//   confidence: 0.92,
//   source: "ml_model"
// }
```

### Error Handling

If ML service is unavailable:
1. System logs warning
2. Falls back to rule-based prediction
3. Returns response with `source: "fallback"`

## Troubleshooting

### Issue: ModuleNotFoundError

```bash
# Solution: Install missing requirements
pip install -r requirements.txt
```

### Issue: Port 8000 Already in Use

```bash
# Solution: Kill existing process or use different port
# Modify model.py uvicorn.run() parameters
uvicorn.run("model:app", host="0.0.0.0", port=8001)
```

### Issue: Model Files Not Found

```bash
# Solution: Train model first
python train.py
# This creates the models/ directory and all .pkl files
```

### Issue: Poor Predictions (High Confidence but Wrong Value)

```bash
# Solution: Retrain model with new data
python train.py
```

## Performance Monitoring

### Prediction Latency

- Random Forest alone: ~5-10ms
- Linear Regression alone: ~1-2ms
- Ensemble average: ~8ms
- API overhead: ~50-100ms
- **Total API call: ~100-150ms**

### Scaling

To handle more predictions:

1. Increase Python workers:
   ```bash
   ENV WORKERS=4
   ```

2. Use async predictions:
   ```python
   # In model.py, use async def
   async def predict_co2(request):
       # Async implementation
   ```

## Advanced Usage

### Retraining with New Data

```python
# Add new data to training
df_new = pd.read_csv('new_data.csv')
df_combined = pd.concat([df_existing, df_new])

# Train with combined data
train_model(df_combined)
```

### Custom Thresholds

Edit `train.py` to adjust emission factors:

```python
emission_factors = {
    'car': 0.21,  # Adjust based on vehicle type
    'bike': 0.1,
    'public_transport': 0.05
}
```

### Adding New Categories

1. Update `train.py` to include new category data
2. Update category encoder
3. Retrain model
4. Update frontend category options

## Next Steps

1. ✅ Install dependencies
2. ✅ Train model: `python train.py`
3. ✅ Start ML service: `python model.py`
4. ✅ Backend automatically calls ML API
5. ✅ Test predictions in frontend

## Documentation

- Model training: See `train.py` docstrings
- API specification: Visit `http://localhost:8000/docs`
- Integration guide: See `backend/services/predictionService.js`

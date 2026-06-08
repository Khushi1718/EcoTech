"""
FastAPI ML Prediction Service for CO2 Emissions
Loads trained models and exposes REST API for predictions
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import joblib
import numpy as np
import os
from pathlib import Path
import sys

# ============ SETUP ============

app = FastAPI(
    title="EcoTech CO2 Prediction Service",
    description="Real AI-powered CO2 emission prediction using ML models",
    version="1.0.0"
)

# Add CORS middleware to allow requests from Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model files directory
MODEL_DIR = Path(__file__).parent / "models"

# Load trained models
print("🔄 Loading trained ML models...")
rf_model = joblib.load(MODEL_DIR / "rf_model.pkl")
lr_model = joblib.load(MODEL_DIR / "lr_model.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
encoders = joblib.load(MODEL_DIR / "encoders.pkl")
print("✅ Models loaded successfully!")

# ============ REQUEST/RESPONSE MODELS ============

class PredictionRequest(BaseModel):
    """Input data for CO2 prediction"""
    category: str  # "Carbon Footprint", "Food Wastage", "Electricity Usage"
    distance: float = 0
    travelMode: Optional[str] = None  # "car", "bike", "public_transport"
    quantity: float = 0
    units: float = 0
    weekday: int = 0  # 0-6 (Monday-Sunday)
    season: str = "spring"  # "spring", "summer", "autumn", "winter"

class PredictionResponse(BaseModel):
    """ML model prediction response"""
    predicted_co2: float
    confidence: float
    model_type: str
    unit: str
    factors: dict

class BatchPredictionRequest(BaseModel):
    """Batch prediction request"""
    predictions: List[PredictionRequest]

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    models_loaded: bool
    timestamp: str

# ============ HELPER FUNCTIONS ============

def prepare_features(data: PredictionRequest):
    """
    Convert input data to model features
    """
    try:
        # Encode categories
        category_encoded = encoders['category'].transform([data.category])[0]
        travel_mode = data.travelMode if data.travelMode else 'none'
        travelMode_encoded = encoders['travelMode'].transform([travel_mode])[0]
        season_encoded = encoders['season'].transform([data.season])[0]
        
        # Feature vector
        features = np.array([[
            data.distance,
            data.quantity,
            data.units,
            data.weekday,
            category_encoded,
            travelMode_encoded,
            season_encoded
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        return features_scaled, {
            'distance': data.distance,
            'quantity': data.quantity,
            'units': data.units,
            'weekday': data.weekday,
            'category': data.category,
            'travelMode': data.travelMode,
            'season': data.season
        }
    
    except Exception as e:
        raise ValueError(f"Feature preparation failed: {str(e)}")

def calculate_confidence(rf_pred, lr_pred):
    """
    Calculate confidence score based on model agreement
    Higher agreement = higher confidence
    """
    if rf_pred == 0 or lr_pred == 0:
        return 0.5
    
    # Percentage difference
    percent_diff = abs(rf_pred - lr_pred) / max(rf_pred, lr_pred)
    
    # Convert to confidence (lower difference = higher confidence)
    confidence = max(0, 1 - percent_diff)
    
    return round(confidence, 4)

# ============ API ENDPOINTS ============

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    from datetime import datetime
    return {
        "status": "healthy",
        "models_loaded": True,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_co2(request: PredictionRequest):
    """
    Predict CO2 emission for a single activity
    
    Args:
        category: Activity category
        distance: Travel distance in km (for Carbon Footprint)
        travelMode: Travel mode (car/bike/public_transport)
        quantity: Food waste in kg (for Food Wastage)
        units: Electricity usage in kWh (for Electricity Usage)
        weekday: Day of week (0-6)
        season: Season (spring/summer/autumn/winter)
    
    Returns:
        Predicted CO2 emission in kg with confidence score
    """
    try:
        # Prepare features
        features_scaled, input_data = prepare_features(request)
        
        # Get predictions from both models
        rf_prediction = rf_model.predict(features_scaled)[0]
        lr_prediction = lr_model.predict(features_scaled)[0]
        
        # Ensemble: weighted average (RF-weighted more because it captures non-linearity)
        predicted_co2 = (0.7 * rf_prediction + 0.3 * lr_prediction)
        predicted_co2 = max(0, round(predicted_co2, 2))  # Ensure non-negative
        
        # Calculate confidence
        confidence = calculate_confidence(rf_prediction, lr_prediction)
        
        return PredictionResponse(
            predicted_co2=predicted_co2,
            confidence=confidence,
            model_type="Ensemble (Random Forest 70% + Linear Regression 30%)",
            unit="kg CO₂",
            factors=input_data
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict-batch")
async def predict_batch(request: BatchPredictionRequest):
    """
    Batch predictions for multiple activities
    """
    try:
        results = []
        for pred_req in request.predictions:
            features_scaled, input_data = prepare_features(pred_req)
            
            rf_prediction = rf_model.predict(features_scaled)[0]
            lr_prediction = lr_model.predict(features_scaled)[0]
            predicted_co2 = max(0, 0.7 * rf_prediction + 0.3 * lr_prediction)
            confidence = calculate_confidence(rf_prediction, lr_prediction)
            
            results.append({
                "predicted_co2": round(predicted_co2, 2),
                "confidence": confidence,
                "category": pred_req.category
            })
        
        return {
            "status": "success",
            "count": len(results),
            "predictions": results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.get("/model-info")
async def model_info():
    """Get information about loaded models"""
    return {
        "models": {
            "random_forest": {
                "n_estimators": rf_model.n_estimators,
                "max_depth": rf_model.max_depth,
                "type": "RandomForestRegressor"
            },
            "linear_regression": {
                "type": "LinearRegression",
                "n_features": lr_model.n_features_in_
            }
        },
        "ensemble_weights": {
            "random_forest": 0.7,
            "linear_regression": 0.3
        },
        "categories": ["Carbon Footprint", "Food Wastage", "Electricity Usage"],
        "travel_modes": ["car", "bike", "public_transport"],
        "seasons": ["spring", "summer", "autumn", "winter"]
    }

# ============ ROOT ENDPOINT ============

@app.get("/")
async def root():
    """Root endpoint with API documentation"""
    return {
        "service": "EcoTech CO2 Prediction Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predict": "POST /predict",
            "predict_batch": "POST /predict-batch",
            "model_info": "/model-info",
            "docs": "/docs"
        },
        "documentation": "Visit /docs for interactive API documentation"
    }

# ============ RUN SERVER ============

if __name__ == "__main__":
    import uvicorn
    
    # Read port from environment variable (Render sets this)
    port = int(os.environ.get("PORT", 8000))
    host = "0.0.0.0"
    
    print("\n" + "=" * 60)
    print("🚀 STARTING ML PREDICTION SERVICE")
    print("=" * 60)
    print(f"📍 Host: {host}")
    print(f"📍 Port: {port}")
    print(f"📍 API available at: http://0.0.0.0:{port}")
    print(f"📚 Docs: http://0.0.0.0:{port}/docs")
    print("=" * 60 + "\n")
    
    uvicorn.run(
        "model:app",
        host=host,
        port=port,
        reload=False,
        log_level="info"
    )

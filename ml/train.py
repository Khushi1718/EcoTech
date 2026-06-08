"""
ML Model Training for CO2 Emission Prediction
Real ML Regression Model: Random Forest + Linear Regression Ensemble
Training dataset: Realistic car travel, food waste, and electricity data
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import os
from datetime import datetime

# Create output directory for models
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

# ============  GENERATE REALISTIC TRAINING DATASET ============

def generate_training_data(n_samples=500):
    """
    Generate realistic data for CO2 emission prediction
    Covers: Car travel, food waste, electricity usage
    """
    np.random.seed(42)
    
    data = {
        'category': [],
        'distance': [],
        'travelMode': [],
        'quantity': [],
        'units': [],
        'weekday': [],
        'season': [],
        'co2_emission': []
    }
    
    # ===== CARBON FOOTPRINT DATA (Car, Bike, Public Transport) =====
    for _ in range(n_samples // 3):
        category = 'Carbon Footprint'
        
        # Travel modes with realistic patterns
        travel_mode = np.random.choice(['car', 'bike', 'public_transport'], p=[0.5, 0.2, 0.3])
        distance = np.random.normal(loc=25, scale=15) if travel_mode == 'car' else np.random.normal(loc=8, scale=4)
        distance = max(0.5, distance)  # Min 0.5 km
        
        # Base emission factors
        emission_factors = {
            'car': 0.21,
            'bike': 0.1,
            'public_transport': 0.05
        }
        
        # Weather/seasonal adjustments
        season = np.random.choice(['spring', 'summer', 'autumn', 'winter'])
        season_factor = {'spring': 1.0, 'summer': 0.95, 'autumn': 1.05, 'winter': 1.15}[season]
        
        # Realistic CO2 calculation with noise
        base_co2 = distance * emission_factors[travel_mode]
        co2 = base_co2 * season_factor * np.random.uniform(0.9, 1.1)  # ±10% noise
        
        data['category'].append(category)
        data['distance'].append(round(distance, 2))
        data['travelMode'].append(travel_mode)
        data['quantity'].append(0)
        data['units'].append(0)
        data['weekday'].append(np.random.randint(0, 7))
        data['season'].append(season)
        data['co2_emission'].append(round(co2, 2))
    
    # ===== FOOD WASTAGE DATA =====
    for _ in range(n_samples // 3):
        category = 'Food Wastage'
        quantity = np.random.normal(loc=0.6, scale=0.3)
        quantity = max(0.1, min(quantity, 2.0))  # Between 0.1 and 2 kg
        
        season = np.random.choice(['spring', 'summer', 'autumn', 'winter'])
        
        # Base: 1kg food = 2.5 kg CO2, with variation
        base_co2 = quantity * 2.5
        # Add seasonal variation (winter storage affects decomposition)
        season_factor = {'spring': 1.0, 'summer': 0.9, 'autumn': 0.95, 'winter': 1.2}[season]
        co2 = base_co2 * season_factor * np.random.uniform(0.95, 1.05)
        
        data['category'].append(category)
        data['distance'].append(0)
        data['travelMode'].append(None)
        data['quantity'].append(round(quantity, 2))
        data['units'].append(0)
        data['weekday'].append(np.random.randint(0, 7))
        data['season'].append(season)
        data['co2_emission'].append(round(co2, 2))
    
    # ===== ELECTRICITY USAGE DATA =====
    for _ in range(n_samples // 3):
        category = 'Electricity Usage'
        units = np.random.normal(loc=4.5, scale=2.5)
        units = max(0.5, min(units, 15))  # Between 0.5 and 15 kWh
        
        season = np.random.choice(['spring', 'summer', 'autumn', 'winter'])
        
        # Regional variation: grid carbon intensity (0.3-0.8 kg CO2/kWh)
        # High winter because of heating and lower temps reducing solar efficiency
        grid_factor = {'spring': 0.45, 'summer': 0.35, 'autumn': 0.50, 'winter': 0.65}[season]
        
        # Realistic calculation
        co2 = units * grid_factor * np.random.uniform(0.9, 1.1)
        
        data['category'].append(category)
        data['distance'].append(0)
        data['travelMode'].append(None)
        data['quantity'].append(0)
        data['units'].append(round(units, 2))
        data['weekday'].append(np.random.randint(0, 7))
        data['season'].append(season)
        data['co2_emission'].append(round(co2, 2))
    
    return pd.DataFrame(data)

# ============  PREPARE DATA FOR ML MODEL ============

def preprocess_data(df):
    """
    Prepare data for ML model training
    """
    df = df.copy()
    
    # Encode categorical variables
    le_category = LabelEncoder()
    le_travel = LabelEncoder()
    le_season = LabelEncoder()
    
    df['category_encoded'] = le_category.fit_transform(df['category'])
    df['travelMode_encoded'] = le_travel.fit_transform(df['travelMode'].fillna('none'))
    df['season_encoded'] = le_season.fit_transform(df['season'])
    
    # Store encoders for later use
    encoders = {
        'category': le_category,
        'travelMode': le_travel,
        'season': le_season
    }
    
    return df, encoders

# ============ STEP 3: TRAIN ML MODELS ============

def train_model(df):
    """
    Train ensemble of Random Forest + Linear Regression
    Random Forest captures non-linear patterns
    Linear Regression provides interpretability
    """
    df, encoders = preprocess_data(df)
    
    # Features for model
    feature_cols = ['distance', 'quantity', 'units', 'weekday', 'category_encoded', 'travelMode_encoded', 'season_encoded']
    X = df[feature_cols]
    y = df['co2_emission']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # ===== Model 1: Random Forest (Primary) =====
    print("🌲 Training Random Forest Model...")
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train_scaled, y_train)
    rf_score = rf_model.score(X_test_scaled, y_test)
    print(f"   Random Forest R² Score: {rf_score:.4f}")
    
    # ===== Model 2: Linear Regression (Fallback) =====
    print("📈 Training Linear Regression Model...")
    lr_model = LinearRegression()
    lr_model.fit(X_train_scaled, y_train)
    lr_score = lr_model.score(X_test_scaled, y_test)
    print(f"   Linear Regression R² Score: {lr_score:.4f}")
    
    # ===== Ensemble: Average predictions =====
    print("\n✅ Ensemble Model Created (avg of RF + LR)")
    
    # Save models
    print("\n💾 Saving models...")
    joblib.dump(rf_model, os.path.join(MODEL_DIR, 'rf_model.pkl'))
    joblib.dump(lr_model, os.path.join(MODEL_DIR, 'lr_model.pkl'))
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.pkl'))
    joblib.dump(encoders, os.path.join(MODEL_DIR, 'encoders.pkl'))
    
    print(f"   ✓ Models saved to {MODEL_DIR}")
    
    # Feature importance
    print(f"\n📊 Feature Importance (Random Forest):")
    for feat, imp in zip(feature_cols, rf_model.feature_importances_):
        print(f"   {feat}: {imp:.4f}")
    
    return rf_model, lr_model, scaler, encoders

# ============ STEP 4: MAIN EXECUTION ============

if __name__ == "__main__":
    print("=" * 60)
    print("🤖 CO2 EMISSION PREDICTION MODEL TRAINING")
    print("=" * 60)
    
    # Generate data
    print("\n📊 Generating training dataset...")
    df = generate_training_data(n_samples=500)
    print(f"   ✓ Generated {len(df)} training samples")
    print(f"\n   Data Distribution:")
    print(df['category'].value_counts())
    
    print(f"\n   CO2 Emission Statistics (kg):")
    print(f"   Mean: {df['co2_emission'].mean():.2f}")
    print(f"   Std: {df['co2_emission'].std():.2f}")
    print(f"   Min: {df['co2_emission'].min():.2f}")
    print(f"   Max: {df['co2_emission'].max():.2f}")
    
    # Save raw data for reference
    df.to_csv(os.path.join(MODEL_DIR, 'training_data.csv'), index=False)
    print(f"\n   ✓ Training data saved to training_data.csv")
    
    # Train model
    print("\n" + "=" * 60)
    print("🚀 TRAINING MODELS...")
    print("=" * 60)
    rf_model, lr_model, scaler, encoders = train_model(df)
    
    print("\n" + "=" * 60)
    print("✅ TRAINING COMPLETE!")
    print("=" * 60)
    print(f"\nModels ready for production at: {MODEL_DIR}")
    print(f"Next step: Start the ML prediction API server")

/**
 * ML Prediction Service
 * Calls the Python FastAPI ML service to predict CO2 emissions
 * Includes error handling and fallback logic
 */

const axios = require('axios');

// ML Service configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const TIMEOUT = 5000; // 5 seconds

// Fallback rule-based prediction if ML service is down
const fallbackCalculateCO2 = (category, data) => {
  if (category === "Food Wastage") {
    return (data.quantity || 0) * 2.5;
  } else if (category === "Carbon Footprint") {
    const factors = {
      car: 0.21,
      bike: 0.1,
      public_transport: 0.05,
    };
    const factor = factors[data.travelMode] || 0.1;
    return parseFloat(((data.distance || 0) * factor).toFixed(2));
  } else if (category === "Electricity Usage") {
    return parseFloat(((data.units || 0) * 0.5).toFixed(2));
  }
  return 0;
};

/**
 * Call ML service to predict CO2 emission
 * 
 * @param {string} category - Activity category
 * @param {object} data - Input data with distance, travelMode, quantity, units
 * @returns {Promise<object>} - Prediction result with CO2, confidence, and metadata
 */
const predictCO2 = async (category, data) => {
  try {
    // Prepare request payload
    const payload = {
      category,
      distance: data.distance || 0,
      travelMode: data.travelMode || null,
      quantity: data.quantity || 0,
      units: data.units || 0,
      weekday: new Date().getDay() || 0,
      season: getCurrentSeason(),
    };

    console.log(`🤖 Calling ML Service: ${ML_SERVICE_URL}/predict`);
    console.log('   Payload:', JSON.stringify(payload, null, 2));

    // Call ML prediction API
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict`,
      payload,
      { timeout: TIMEOUT }
    );

    console.log(`✅ ML Prediction Success: ${response.data.predicted_co2} kg CO2`);
    console.log(`   Confidence: ${response.data.confidence}`);

    return {
      predicted_co2: response.data.predicted_co2,
      confidence: response.data.confidence,
      model_type: response.data.model_type,
      unit: response.data.unit,
      factors: response.data.factors,
      source: 'ml_model',
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.warn('⚠️  ML Service Error:', error.message);
    console.log('🔄 Using fallback rule-based prediction...');

    // Fallback: Use rule-based logic
    const fallbackCO2 = fallbackCalculateCO2(category, data);
    return {
      predicted_co2: fallbackCO2,
      confidence: 0.65,
      model_type: 'Fallback (Rule-Based)',
      unit: 'kg CO₂',
      factors: {
        distance: data.distance || 0,
        quantity: data.quantity || 0,
        units: data.units || 0,
        category,
        travelMode: data.travelMode,
        season: getCurrentSeason(),
      },
      source: 'fallback',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get current season
 */
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

/**
 * Health check for ML service
 */
const checkMLServiceHealth = async () => {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/health`,
      { timeout: TIMEOUT }
    );
    return {
      healthy: response.data.status === 'healthy',
      models_loaded: response.data.models_loaded,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
    };
  }
};

/**
 * Get ML model information
 */
const getModelInfo = async () => {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/model-info`,
      { timeout: TIMEOUT }
    );
    return response.data;
  } catch (error) {
    return {
      error: error.message,
      status: 'ml_service_unavailable',
    };
  }
};

module.exports = {
  predictCO2,
  checkMLServiceHealth,
  getModelInfo,
  ML_SERVICE_URL,
};

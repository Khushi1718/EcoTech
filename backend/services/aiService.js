/**
 * AI Suggestion Service
 * Uses OpenAI API to generate intelligent, personalized eco-friendly suggestions
 * Provides fallback rule-based suggestions if API is unavailable
 */

const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const TIMEOUT = 8000; // 8 seconds for API calls

/**
 * Fallback rule-based suggestions (keep as backup)
 */
const fallbackSuggestions = (category, data) => {
  const suggestions = [];

  if (category === "Food Wastage") {
    const qty = data.quantity || 0;
    suggestions.push("Store leftovers in airtight containers to prevent spoilage");
    if (qty > 0.5) suggestions.push("Reduce portion sizes to minimize waste");
    suggestions.push("Compost food scraps to create nutrient-rich soil");
  } else if (category === "Carbon Footprint") {
    const mode = data.travelMode;
    if (mode === "car") {
      suggestions.push("Try carpooling or public transport to reduce emissions");
      suggestions.push("Use a bike for short distances under 5km");
    } else if (mode === "public_transport") {
      suggestions.push("Great choice! Keep using public transport");
    }
    suggestions.push("Walk or cycle for distances under 5km whenever possible");
  } else if (category === "Electricity Usage") {
    suggestions.push("Switch to LED bulbs to save 75% on lighting energy");
    suggestions.push("Turn off devices when not in use to reduce standby power");
    if (data.units > 5) suggestions.push("Use ENERGY STAR certified appliances");
  }

  return suggestions.slice(0, 3);
};

/**
 * Generate intelligent suggestions using OpenAI GPT
 * 
 * @param {string} category - Activity category
 * @param {object} data - Input data
 * @param {object} predictionData - ML prediction data
 * @returns {Promise<array>} - Array of 3 intelligent suggestions
 */
const generateSuggestions = async (category, data, predictionData = {}) => {
  // If OpenAI API key is not configured, use fallback
  if (!OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not configured. Using fallback suggestions.');
    return fallbackSuggestions(category, data);
  }

  try {
    // Build context-aware prompt
    const prompt = buildPrompt(category, data, predictionData);

    console.log('🤖 Calling OpenAI GPT...');
    console.log('   Prompt:', prompt.substring(0, 100) + '...');

    // Call OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an eco-friendly sustainability expert. Generate practical, personalized, and actionable suggestions to help users reduce their carbon footprint. Always provide exactly 3 suggestions. Keep each suggestion concise (under 80 characters).`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: TIMEOUT,
      }
    );

    // Parse response
    const content = response.data.choices[0].message.content;
    const suggestions = parseSuggestions(content);

    console.log('✅ AI Suggestions Generated:');
    suggestions.forEach((s, i) => console.log(`   ${i + 1}. ${s}`));

    return {
      suggestions: suggestions.slice(0, 3),
      model: 'GPT-3.5-Turbo',
      source: 'openai',
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.warn('⚠️  OpenAI API Error:', error.message);
    console.log('🔄 Using fallback rule-based suggestions...');

    return {
      suggestions: fallbackSuggestions(category, data),
      model: 'Fallback (Rule-Based)',
      source: 'fallback',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Build context-aware prompt for OpenAI
 */
const buildPrompt = (category, data, predictionData) => {
  let prompt = '';

  if (category === 'Carbon Footprint') {
    const distance = data.distance || 0;
    const mode = data.travelMode || 'car';
    const co2 = predictionData?.predicted_co2 || 0;
    const confidence = predictionData?.confidence || 0;

    prompt = `User traveled ${distance} km by ${mode}. 
Predicted CO2 emission: ${co2} kg (confidence: ${confidence * 100}%).
Generate 3 specific ways to reduce carbon footprint from travel.`;
  } 
  else if (category === 'Food Wastage') {
    const qty = data.quantity || 0;
    const co2 = predictionData?.predicted_co2 || 0;

    prompt = `User wasted ${qty} kg of food today.
Predicted CO2 emission: ${co2} kg.
Generate 3 practical ways to reduce food waste and its environmental impact.`;
  } 
  else if (category === 'Electricity Usage') {
    const units = data.units || 0;
    const co2 = predictionData?.predicted_co2 || 0;

    prompt = `User consumed ${units} kWh of electricity.
Predicted CO2 emission: ${co2} kg.
Generate 3 actionable ways to reduce electricity consumption and carbon footprint.`;
  }

  return prompt;
};

/**
 * Parse OpenAI response to extract suggestions
 */
const parseSuggestions = (content) => {
  // Try to split by numbers (1., 2., 3.)
  let suggestions = content.split(/\d+\.\s+/).filter(s => s.trim());

  // If that doesn't work, try splitting by newlines
  if (suggestions.length < 2) {
    suggestions = content.split('\n').filter(s => s.trim());
  }

  // Clean and trim suggestions
  suggestions = suggestions
    .map(s => s.replace(/^[-•]\s*/, '').trim())
    .filter(s => s.length > 0)
    .slice(0, 3);

  // Ensure we have exactly 3 suggestions
  while (suggestions.length < 3) {
    suggestions.push('Consider your environmental impact regularly');
  }

  return suggestions.slice(0, 3);
};

/**
 * Generate enhanced user profile insights using AI
 * (Optional advanced feature)
 */
const generateUserInsights = async (userId, weeklyStats) => {
  if (!OPENAI_API_KEY) {
    return null;
  }

  try {
    const prompt = `Analyze this user's weekly eco data and provide 2-3 sentence insight:
    Total CO2: ${weeklyStats.totalCO2} kg
    Best Day: ${weeklyStats.bestDay}
    Total Activities: ${weeklyStats.totalActivities}
    Average Daily Emissions: ${weeklyStats.averageDailyEmissions} kg
    
    Keep it encouraging and actionable.`;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an eco-friendly sustainability coach providing personalized insights.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: TIMEOUT,
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.warn('Error generating user insights:', error.message);
    return null;
  }
};

module.exports = {
  generateSuggestions,
  generateUserInsights,
  fallbackSuggestions,
};

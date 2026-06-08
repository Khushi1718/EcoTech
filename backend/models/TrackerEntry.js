const mongoose = require("mongoose");

const TrackerEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["Food Wastage", "Carbon Footprint", "Electricity Usage"],
      required: true,
    },
    // Food Wastage fields
    quantity: {
      type: Number,
      default: 0,
      description: "kg of food wasted",
    },
    // Carbon Footprint fields
    travelMode: {
      type: String,
      enum: ["car", "bike", "public_transport"],
      default: null,
    },
    distance: {
      type: Number,
      default: 0,
      description: "km traveled",
    },
    // Electricity fields
    units: {
      type: Number,
      default: 0,
      description: "kWh consumed",
    },
    // AI Analysis - ML Model Prediction
    estimatedCO2: {
      type: Number,
      default: 0,
      description: "kg CO2 emitted (predicted by ML model)",
    },
    impactLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    modelConfidence: {
      type: Number,
      default: 0.5,
      description: "ML model prediction confidence score (0-1)",
    },
    predictionSource: {
      type: String,
      enum: ["ml_model", "fallback"],
      default: "ml_model",
      description: "Whether prediction came from ML model or fallback logic",
    },
    // AI-Generated Suggestions
    suggestions: {
      type: [String],
      default: [],
      description: "AI-generated eco-friendly suggestions",
    },
    suggestionSource: {
      type: String,
      enum: ["openai", "fallback"],
      default: "openai",
      description: "Whether suggestions came from OpenAI or fallback logic",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrackerEntry", TrackerEntrySchema);

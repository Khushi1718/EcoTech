const DailyLog = require("../models/DailyLog");
const TrackerEntry = require("../models/TrackerEntry");
const { predictCO2 } = require("../services/predictionService");
const { generateSuggestions } = require("../services/aiService");

// ========== CATEGORIZE IMPACT BASED ON PREDICTED CO2 VALUE ==========

/**
 * Categorize impact level based on predicted CO2 emission value
 * Uses dynamic thresholds based on historical data percentiles
 */
const categorizeImpact = (co2Value, category) => {
  // Dynamic thresholds based on typical CO2 emissions
  const thresholds = {
    "Food Wastage": { high: 2.0, medium: 1.0 },
    "Carbon Footprint": { high: 10.0, medium: 5.0 },
    "Electricity Usage": { high: 5.0, medium: 2.5 },
  };

  const categoryThresholds = thresholds[category] || { high: 10, medium: 5 };

  if (co2Value >= categoryThresholds.high) {
    return "HIGH";
  } else if (co2Value >= categoryThresholds.medium) {
    return "MEDIUM";
  } else {
    return "LOW";
  }
};

// ========== GOOD WORK LOG ENDPOINTS ==========

exports.addGoodWorkLog = async (req, res) => {
  try {
    const { userId, title, tag, description, date } = req.body;

    if (!userId || !title || !tag) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse date - use provided date or default to today
    let logDate = new Date();
    if (date) {
      logDate = new Date(date);
    }
    // Normalize to start of day (00:00:00) for consistent date-based queries
    logDate = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());

    const log = new DailyLog({
      userId,
      title,
      tag,
      description,
      date: logDate,
      value: 0,
    });

    await log.save();

    res.status(201).json({
      message: "Good work logged!",
      log,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGoodWorkLogs = async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await DailyLog.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      message: "Good work logs retrieved",
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== TODAY'S TRACKER ENDPOINTS ==========

exports.trackActivity = async (req, res) => {
  try {
    const { userId, category, quantity, travelMode, distance, units, date } =
      req.body;

    if (!userId || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse date - use provided date or default to today
    let entryDate = new Date();
    if (date) {
      entryDate = new Date(date);
    }
    // Normalize to start of day for consistent date-based queries
    entryDate = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());

    const data = {
      quantity,
      travelMode,
      distance,
      units,
    };

    // ========== STEP 1: USE ML MODEL FOR CO2 PREDICTION ==========
    console.log(`📊 Tracking activity: ${category}`);
    const predictionResult = await predictCO2(category, data);
    const estimatedCO2 = predictionResult.predicted_co2;
    const modelConfidence = predictionResult.confidence;

    // ========== STEP 2: CATEGORIZE IMPACT BASED ON PREDICTED VALUE ==========
    const impactLevel = categorizeImpact(estimatedCO2, category);

    // ========== STEP 3: GENERATE AI SUGGESTIONS USING OPENAI ==========
    const suggestionResult = await generateSuggestions(category, data, predictionResult);
    const suggestions = Array.isArray(suggestionResult.suggestions) 
      ? suggestionResult.suggestions 
      : suggestionResult;

    // ========== STEP 4: SAVE TO DATABASE ==========
    const entry = new TrackerEntry({
      userId,
      category,
      quantity,
      travelMode,
      distance,
      units,
      date: entryDate,
      estimatedCO2,
      impactLevel,
      suggestions,
      modelConfidence,
      predictionSource: predictionResult.source,
      suggestionSource: suggestionResult.source,
    });

    await entry.save();

    // ========== STEP 5: RETURN RESPONSE ==========
    res.status(201).json({
      message: "Activity tracked successfully",
      entry,
      prediction: {
        predicted_co2: estimatedCO2,
        confidence: modelConfidence,
        model_type: predictionResult.model_type,
        source: predictionResult.source,
      },
      suggestions,
      impactLevel,
    });
  } catch (error) {
    console.error("Error tracking activity:", error);
    res.status(500).json({ 
      message: error.message,
      error: error.toString()
    });
  }
};

exports.getTodayActivities = async (req, res) => {
  try {
    const { userId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const activities = await TrackerEntry.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ date: -1 });

    res.status(200).json({
      message: "Today's activities retrieved",
      activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== WEEKLY ANALYZER ENDPOINTS ==========

exports.getWeeklyStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trackerEntries = await TrackerEntry.find({
      userId,
      date: { $gte: sevenDaysAgo },
    });

    const totalCO2 = trackerEntries.reduce(
      (sum, entry) => sum + parseFloat(entry.estimatedCO2 || 0),
      0
    );

    const impactCounts = {
      HIGH: trackerEntries.filter((e) => e.impactLevel === "HIGH").length,
      MEDIUM: trackerEntries.filter((e) => e.impactLevel === "MEDIUM").length,
      LOW: trackerEntries.filter((e) => e.impactLevel === "LOW").length,
    };

    const categoryBreakdown = {};
    trackerEntries.forEach((entry) => {
      categoryBreakdown[entry.category] =
        (categoryBreakdown[entry.category] || 0) +
        parseFloat(entry.estimatedCO2 || 0);
    });

    res.status(200).json({
      message: "Weekly stats retrieved",
      totalCO2: totalCO2.toFixed(2),
      impactCounts,
      categoryBreakdown,
      totalActivities: trackerEntries.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== GROUPED BY DATE FOR WEEKLY VIEW ==========

exports.getActivitiesByDay = async (req, res) => {
  try {
    const { userId } = req.params;

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const trackerEntries = await TrackerEntry.find({
      userId,
      date: { $gte: sevenDaysAgo, $lte: today },
    }).sort({ date: 1 });

    const goodWorkLogs = await DailyLog.find({
      userId,
      date: { $gte: sevenDaysAgo, $lte: today },
    }).sort({ date: 1 });

    // Group by date
    const groupedByDate = {};

    trackerEntries.forEach((entry) => {
      const dateKey = new Date(entry.date).toLocaleDateString();
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { tracker: [], logs: [] };
      }
      groupedByDate[dateKey].tracker.push(entry);
    });

    goodWorkLogs.forEach((log) => {
      const dateKey = new Date(log.date).toLocaleDateString();
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { tracker: [], logs: [] };
      }
      groupedByDate[dateKey].logs.push(log);
    });

    res.status(200).json({
      message: "Activities grouped by date",
      data: groupedByDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

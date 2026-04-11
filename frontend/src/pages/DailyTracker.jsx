import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  Leaf,
  Zap,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";

const DailyTracker = () => {
  const [activeTab, setActiveTab] = useState("goodwork"); // "goodwork" or "tracker"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Get user ID
  const userId = (() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user)?.id : null;
    } catch {
      return null;
    }
  })();

  // ========== GOOD WORK LOG STATE ==========
  const [goodWorkForm, setGoodWorkForm] = useState({
    title: "",
    tag: "Tree Plantation",
    description: "",
  });

  // ========== TODAY'S TRACKER STATE ==========
  const [trackerForm, setTrackerForm] = useState({
    category: "Food Wastage",
    quantity: 0,
    travelMode: "car",
    distance: 0,
    units: 0,
  });

  const [result, setResult] = useState(null);

  // ========== GOOD WORK LOG HANDLERS ==========
  const handleGoodWorkChange = (e) => {
    const { name, value } = e.target;
    setGoodWorkForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoodWorkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!userId) {
        setMessage({ type: "error", text: "Please log in to save entries" });
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/daily/log", {
        userId,
        title: goodWorkForm.title,
        tag: goodWorkForm.tag,
        description: goodWorkForm.description,
        date: new Date(),
      });

      setMessage({
        type: "success",
        text: "Great job! Your good deed has been logged!",
      });

      // Reset form
      setGoodWorkForm({
        title: "",
        tag: "Tree Plantation",
        description: "",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error logging good work",
      });
    } finally {
      setLoading(false);
    }
  };

  // ========== TODAY'S TRACKER HANDLERS ==========
  const handleTrackerChange = (e) => {
    const { name, value } = e.target;
    setTrackerForm((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value),
    }));
  };

  const handleTrackerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      if (!userId) {
        setResult({
          type: "error",
          text: "Please log in to save entries",
        });
        setLoading(false);
        return;
      }

      const payload = {
        userId,
        category: trackerForm.category,
        quantity:
          trackerForm.category === "Food Wastage" ? trackerForm.quantity : 0,
        travelMode:
          trackerForm.category === "Carbon Footprint"
            ? trackerForm.travelMode
            : null,
        distance:
          trackerForm.category === "Carbon Footprint" ? trackerForm.distance : 0,
        units:
          trackerForm.category === "Electricity Usage" ? trackerForm.units : 0,
        date: new Date(),
      };

      const response = await axios.post("/api/daily/track", payload);

      setResult({
        type: "success",
        data: response.data,
      });

      // Reset form
      setTrackerForm({
        category: "Food Wastage",
        quantity: 0,
        travelMode: "car",
        distance: 0,
        units: 0,
      });

      setTimeout(() => setResult(null), 5000);
    } catch (error) {
      setResult({
        type: "error",
        text: error.response?.data?.message || "Error tracking activity",
      });
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (level) => {
    switch (level) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ========== LEFT SIDEBAR ========== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Options</h3>

              <div className="space-y-3">
                {/* Good Work Log Tab */}
                <button
                  onClick={() => setActiveTab("goodwork")}
                  className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${
                    activeTab === "goodwork"
                      ? "border-green-600 bg-green-50 text-green-900"
                      : "border-gray-300 bg-gray-50 text-gray-700 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Good Work Log</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-normal">
                    Log your eco-friendly actions
                  </p>
                </button>

                {/* Today's Tracker Tab */}
                <button
                  onClick={() => setActiveTab("tracker")}
                  className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${
                    activeTab === "tracker"
                      ? "border-green-600 bg-green-50 text-green-900"
                      : "border-gray-300 bg-gray-50 text-gray-700 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <span>Today's Tracker</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-normal">
                    Track & get AI insights
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* ========== MAIN CONTENT AREA ========== */}
          <div className="lg:col-span-3">
            {/* ========== GOOD WORK LOG SECTION ========== */}
            {activeTab === "goodwork" && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    🌿 Good Work Log
                  </h2>
                  <p className="text-gray-600">
                    Record your eco-friendly accomplishments and positive actions
                  </p>
                </div>

                {message && (
                  <div
                    className={`mb-6 p-4 rounded-lg border ${
                      message.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleGoodWorkSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={goodWorkForm.title}
                      onChange={handleGoodWorkChange}
                      placeholder="e.g., Planted 5 trees"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  {/* Tag */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tag *
                    </label>
                    <select
                      name="tag"
                      value={goodWorkForm.tag}
                      onChange={handleGoodWorkChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Tree Plantation"> Tree Plantation</option>
                      <option value="Energy Saving"> Energy Saving</option>
                      <option value="No Food Waste">No Food Waste</option>
                      <option value="Low Carbon Activity">
                         Low Carbon Activity
                      </option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={goodWorkForm.description}
                      onChange={handleGoodWorkChange}
                      placeholder="Tell us more about what you did..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
                  >
                    {loading ? "Saving..." : "✓ Log Good Work"}
                  </button>
                </form>
              </div>
            )}

            {/* ========== TODAY'S TRACKER SECTION ========== */}
            {activeTab === "tracker" && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                     Today's Tracker
                  </h2>
                  <p className="text-gray-600">
                    Track your activities and get AI-powered suggestions
                  </p>
                </div>

                <form onSubmit={handleTrackerSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Category *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "Food Wastage", icon: "" },
                        { value: "Carbon Footprint", icon: "" },
                        { value: "Electricity Usage", icon: "" },
                      ].map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() =>
                            setTrackerForm((prev) => ({
                              ...prev,
                              category: cat.value,
                            }))
                          }
                          className={`p-3 rounded-lg border-2 transition font-medium text-sm ${
                            trackerForm.category === cat.value
                              ? "border-green-600 bg-green-50 text-green-900"
                              : "border-gray-300 bg-gray-50 text-gray-700 hover:border-green-300"
                          }`}
                        >
                          {cat.icon} {cat.value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Inputs */}
                  {trackerForm.category === "Food Wastage" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quantity Wasted (kg) *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={trackerForm.quantity}
                        onChange={handleTrackerChange}
                        placeholder="0"
                        step="0.1"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  )}

                  {trackerForm.category === "Carbon Footprint" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Travel Mode *
                        </label>
                        <select
                          name="travelMode"
                          value={trackerForm.travelMode}
                          onChange={handleTrackerChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="car"> Car</option>
                          <option value="bike"> Bike</option>
                          <option value="public_transport">
                            Public Transport
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Distance (km) *
                        </label>
                        <input
                          type="number"
                          name="distance"
                          value={trackerForm.distance}
                          onChange={handleTrackerChange}
                          placeholder="0"
                          step="0.1"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {trackerForm.category === "Electricity Usage" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Units Consumed (kWh) *
                      </label>
                      <input
                        type="number"
                        name="units"
                        value={trackerForm.units}
                        onChange={handleTrackerChange}
                        placeholder="0"
                        step="0.1"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
                  >
                    {loading ? "Analyzing..." : "Track & Analyze"}
                  </button>
                </form>

                {/* Result Display */}
                {result && (
                  <div
                    className={`mt-6 p-6 rounded-lg border ${
                      result.type === "success"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    {result.type === "success" ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl"></span>
                          <div>
                            <h4 className="font-semibold text-green-900">
                              Analysis Complete!
                            </h4>
                            <p className="text-green-700 text-sm">
                              Activity tracked with AI insights
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded p-3 border border-green-200">
                            <div className="text-xs text-gray-600 font-medium">
                              Impact Level
                            </div>
                            <div
                              className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold inline-block ${getImpactColor(
                                result.data.impactLevel
                              )}`}
                            >
                              {result.data.impactLevel}
                            </div>
                          </div>

                          <div className="bg-white rounded p-3 border border-green-200">
                            <div className="text-xs text-gray-600 font-medium">
                              CO₂ Estimated
                            </div>
                            <div className="text-2xl font-bold text-green-600 mt-2">
                              {result.data.estimatedCO2} kg
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-green-900 mb-3">
                             AI Suggestions:
                          </h5>
                          <ul className="space-y-2">
                            {result.data.suggestions.map((suggestion, idx) => (
                              <li
                                key={idx}
                                className="flex gap-2 text-sm text-green-800"
                              >
                                <span>•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-900">
                        <p className="font-semibold">Error</p>
                        <p className="text-sm">{result.text}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;
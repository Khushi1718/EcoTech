import React from "react";

export default function Navbar() {
  return (
    <div className="w-full border-b bg-white px-10 py-4 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-xl font-semibold text-green-700">
        EcoTech
      </h1>

      {/* Navigation */}
      <div className="flex gap-10 text-gray-600 font-medium">

        <button className="hover:text-green-600">
          Tracker
        </button>
        <button className="hover:text-green-600">
          Progress
        </button>

        <button className="text-green-600 border-b-2 border-green-600 pb-1">
          Community
        </button>

        <button className="hover:text-green-600">
          Account
        </button>

      </div>

    </div>
  );
}
"use client";

import { useState } from "react";
import Image from "next/image";

export default function TripCostCalculator() {
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [result, setResult] = useState<{ litres: number; cost: number } | null>(null);

  const calculateCost = () => {
    const distNum = parseFloat(distance);
    const mileNum = parseFloat(mileage);
    const priceNum = parseFloat(fuelPrice);

    if (isNaN(distNum) || isNaN(mileNum) || isNaN(priceNum) || mileNum <= 0) {
      setResult(null);
      return;
    }

    const litresNeeded = distNum / mileNum;
    const totalCost = litresNeeded * priceNum;

    setResult({
      litres: parseFloat(litresNeeded.toFixed(2)),
      cost: parseFloat(totalCost.toFixed(2)),
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/images/cover.jpg')" }}
    >
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 text-white">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <Image src="/images/fuel.png" alt="Fuel Icon" width={64} height={64} />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          Trip Cost Calculator
        </h2>

        {/* Distance */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Trip Distance (km)</label>
          <input
            type="number"
            step="0.01"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Mileage */}
        <div className="mb-1">
          <label className="block mb-1 text-sm">Mileage (km/l)</label>
          <input
            type="number"
            step="0.01"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <p className="text-xs text-white/70 mb-4">
          Use your recent mileage, as fuel efficiency changes over time.
        </p>

        {/* Fuel Price */}
        <div className="mb-6">
          <label className="block mb-1 text-sm">Fuel Price (₹/l)</label>
          <input
            type="number"
            step="0.01"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Button */}
        <button
          onClick={calculateCost}
          className="w-full rounded-xl bg-gradient-to-r from-accent to-accent/80 hover:opacity-90 px-4 py-2 font-medium transition"
        >
          Calculate
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 rounded-xl bg-white/10 border border-white/20 p-4 text-center">
            <p className="text-lg">Fuel needed: <span className="text-accent font-bold">{result.litres} L</span></p>
            <p className="text-lg">Total cost: <span className="text-green-400 font-bold">₹{result.cost}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

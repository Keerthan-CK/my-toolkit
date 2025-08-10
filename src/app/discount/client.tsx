"use client";

import React, { JSX, useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function DiscountCalculator(): JSX.Element {
  const [price, setPrice] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  const sanitize = (s: string) => s.replace(/[,\s₹]/g, "");

  const validateAndCalc = (pRaw: string, dRaw: string) => {
    const p = parseFloat(sanitize(pRaw));
    const d = parseFloat(sanitize(dRaw));

    if (isNaN(p)) return { ok: false, msg: "Enter a valid original price." };
    if (p <= 0) return { ok: false, msg: "Price must be greater than 0." };
    if (isNaN(d)) return { ok: false, msg: "Enter a valid discount percentage." };
    if (d < 0 || d > 100) return { ok: false, msg: "Discount must be between 0% and 100%." };

    const discounted = +(p * (1 - d / 100)).toFixed(2);
    return { ok: true, price: discounted };
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    setError(null);
    setFinalPrice(null);

    setTimeout(() => {
      const res = validateAndCalc(price, discount);
      setLoading(false);

      if (!res.ok) {
        setFinalPrice(null);
        setError(res.msg ?? null);
        return;
      }

      setFinalPrice(res.price as number);
      setError(null);
    }, 800);
  };

  const handlePriceChange = (v: string) => {
    setPrice(v);
    setFinalPrice(null);
    setError(null);
    setSubmitted(false);
  };

  const handleDiscountChange = (v: string) => {
    setDiscount(v);
    setFinalPrice(null);
    setError(null);
    setSubmitted(false);
  };

  const sanitizedPriceForSavings =
    finalPrice !== null ? parseFloat(sanitize(price)) : null;
  const savings =
    finalPrice !== null && sanitizedPriceForSavings !== null
      ? +(sanitizedPriceForSavings - finalPrice).toFixed(2)
      : null;

  useEffect(() => {
    document.body.classList.add("discount-bg");
    return () => {
      document.body.classList.remove("discount-bg");
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-screen min-h-screen bg-cover bg-center relative overflow-hidden p-4">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" aria-hidden="true" />

      {/* Lottie Animation */}
      <div className="relative z-10 mt-6 sm:mt-10 flex justify-center items-center h-20 sm:h-24 sm:hidden ">
        <DotLottieReact
          src="https://lottie.host/69faf474-6c7d-434f-a4c1-dd486fe1a831/gnve7zFte4.lottie"
          loop
          autoplay
          style={{ width: "250px", height: "140px" }}
        />
      </div>

{/* Spacer for desktop */}
<div className="hidden sm:block h-20 mt-6" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-6 sm:p-8 ring-1 ring-white/30 mt-8 sm:mt-12">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-primary-300 via-secondary-300 to-primary-300 bg-clip-text text-transparent mb-8 drop-shadow-md">
          Discount Calculator
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Original Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-white/90 mb-2">
              Original Price
            </label>
            <input
              id="price"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              aria-invalid={!!error && submitted}
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full rounded-xl border border-white/30 bg-white/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 backdrop-blur-sm
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Discount Percentage */}
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-white/90 mb-2">
              Discount Percentage (%)
            </label>
            <input
              id="discount"
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="0.01"
              aria-invalid={!!error && submitted}
              value={discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className="w-full rounded-xl border border-white/30 bg-white/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 backdrop-blur-sm
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-gray-900 transition duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300/50 shadow-lg shadow-primary-500/30
            ${loading
              ? "bg-white/20 text-white cursor-wait opacity-70"
              : "bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 hover:opacity-90"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            ) : (
              "Calculate"
            )}
          </button>

          {/* Error Message */}
          {error && submitted && !loading && (
            <p className="text-sm text-red-300 text-center mt-2" role="alert">
              {error}
            </p>
          )}

          {/* Result */}
          {finalPrice !== null && !loading && (
            <div className="mt-6 p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center shadow-inner shadow-white/10">
              <p className="text-lg font-medium text-white/90">
                Final Price:{" "}
                <span className="font-bold text-primary-200">
                  {currencyFormatter.format(finalPrice)}
                </span>
              </p>
              <p className="text-sm text-secondary-200 mt-1">
                You save{" "}
                {savings !== null
                  ? currencyFormatter.format(savings)
                  : "--"}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError(null);
    setSubmitted(true);

    setTimeout(() => {
      const query = new URLSearchParams({
        mode: "forgot",
        email,
      }).toString();

      router.push(`/change_password?${query}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-1">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your email below to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition"
              autoComplete="email"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitted}
            className={`w-full py-2 rounded-lg text-white font-semibold transition 
              ${
                submitted
                  ? "bg-green-400 cursor-not-allowed"
                  : "w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50"
              }`}
          >
            {submitted ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;



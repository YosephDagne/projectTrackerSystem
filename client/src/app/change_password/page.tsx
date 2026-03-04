"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { changePassword } from "@/services/auth";
import { ChangePasswordPayload } from "@/types/login";

const ChangePasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const emailParam = searchParams.get("email") || "";
  const mode = searchParams.get("mode"); // 'forgot' or undefined

  const [email, setEmail] = useState(emailParam);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId && mode !== "forgot") {
      router.push("/login");
    }
  }, [userId, mode, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "forgot" && !email.trim()) {
      return setError("Email is required.");
    }

    if (!newPassword.trim()) return setError("New password is required.");
    if (newPassword.length < 8)
      return setError("New password must be at least 8 characters.");
    if (newPassword !== confirmNewPassword)
      return setError("Passwords do not match.");

    if (!userId && mode !== "forgot") return setError("Invalid user ID.");

    try {
      setLoading(true);
      const payload: ChangePasswordPayload = {
        userId: userId || "",
        email: mode === "forgot" ? email : undefined,
        currentPassword: mode === "forgot" ? undefined : currentPassword,
        newPassword,
        confirmNewPassword,
        isFirstLoginChange: mode !== "forgot",
      };

      await changePassword(payload);

      setSuccess("Password changed successfully.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Password change failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-2xl transition-all">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {mode === "forgot" ? "Reset Your Password" : "Change Your Password"}
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          {mode === "forgot" ? (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition"
            />
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition"
            />
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          {success && (
            <p className="text-sm text-green-600 font-medium">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50"
          >
            {loading
              ? mode === "forgot"
                ? "Resetting..."
                : "Changing..."
              : mode === "forgot"
                ? "Reset Password"
                : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const ChangePassword = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ChangePasswordContent />
  </Suspense>
);

export default ChangePassword;



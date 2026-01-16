"use client";

import { useState, useEffect } from "react";
import { useLogin, useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Add loading state
  const router = useRouter();

  const { isAuthenticated } = useAuth();
  const loginMutation = useLogin();

  // Check auth status on mount
  useEffect(() => {
    // Small delay to ensure localStorage is read
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Redirect if already authenticated (only after checking)
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      router.push("/");
    }
  }, [isCheckingAuth, isAuthenticated, router]);

  // Redirect on successful login
  useEffect(() => {
    if (loginMutation.isSuccess) {
      router.push("/");
    }
  }, [loginMutation.isSuccess, router]);

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  // Don't render form if already authenticated (prevents flash)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400">Redirecting...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm mx-auto p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="emilys"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="emilyspass"
              required
            />
          </div>

          {loginMutation.error && (
            <p className="text-red-400 text-sm">
              {loginMutation.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold rounded py-2 transition disabled:opacity-50"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-500 text-xs mt-4 text-center">
          Test credentials: emilys / emilyspass
        </p>
      </div>
    </div>
  );
}
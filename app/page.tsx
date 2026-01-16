"use client";

import { useAuth, useLogout } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.push("/login"),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 text-red-400 px-4 py-2 rounded hover:bg-red-500/30 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Welcome, {user.firstName}!
          </h2>

          <div className="space-y-2 text-gray-400">
            <p>
              <span className="text-gray-500">ID:</span> {user.id}
            </p>
            <p>
              <span className="text-gray-500">Username:</span> {user.username}
            </p>
            <p>
              <span className="text-gray-500">Email:</span> {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
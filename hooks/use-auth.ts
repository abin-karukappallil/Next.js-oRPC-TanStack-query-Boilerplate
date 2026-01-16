"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/orpc";
import { authStore } from "../lib/auth-store";
import { useEffect, useState } from "react";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const result = await client.login(credentials);
      return result;
    },
    onSuccess: (data) => {
      authStore.setState({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      authStore.clearState();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.clear();
    },
  });
}

export function useUser() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(authStore.getState().accessToken);
    const handleAuthChange = (e: CustomEvent) => {
      setToken(e.detail.accessToken);
    };

    window.addEventListener("auth-change", handleAuthChange as EventListener);
    return () => {
      window.removeEventListener(
        "auth-change",
        handleAuthChange as EventListener
      );
    };
  }, []);

  return useQuery({
    queryKey: ["user", token],
    queryFn: async () => {
      if (!token) return null;
      const result = await client.getMe({ token });
      return result;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, 
    retry: false,
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { refreshToken } = authStore.getState();
      if (!refreshToken) throw new Error("No refresh token");

      const result = await client.refreshToken({ refreshToken });
      return result;
    },
    onSuccess: (data) => {
      authStore.setState({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      authStore.clearState();
    },
  });
}

export function useAuth() {
  const { data: user, isLoading } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false); 

  useEffect(() => {
    setIsAuthenticated(authStore.isAuthenticated());
    setIsReady(true); 

    const handleAuthChange = () => {
      setIsAuthenticated(authStore.isAuthenticated());
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  return {
    user,
    isLoading: isLoading || !isReady, 
    isAuthenticated,
    isReady,
  };
}
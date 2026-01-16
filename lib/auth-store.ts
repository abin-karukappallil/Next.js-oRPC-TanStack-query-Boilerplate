"use client";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
};

const AUTH_STORAGE_KEY = "auth_state";

export const authStore = {
  getState(): AuthState {
    if (typeof window === "undefined") {
      return { accessToken: null, refreshToken: null, user: null };
    }
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return { accessToken: null, refreshToken: null, user: null };
  },

  setState(state: Partial<AuthState>) {
    const current = this.getState();
    const newState = { ...current, ...state };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
    window.dispatchEvent(new CustomEvent("auth-change", { detail: newState }));
  },

  clearState() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("auth-change", {
        detail: { accessToken: null, refreshToken: null, user: null },
      })
    );
  },

  isAuthenticated(): boolean {
    return !!this.getState().accessToken;
  },
};
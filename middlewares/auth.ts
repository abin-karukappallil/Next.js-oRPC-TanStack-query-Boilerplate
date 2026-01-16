import { os } from "@orpc/server";

export type AuthContext = {
  user?: {
    id: number;
    username: string;
    email: string;
  };
  accessToken?: string;
};

// Middleware that requires authentication
export const authMiddleware = os
  .$context<AuthContext>()
  .middleware(async ({ context, next }) => {
    if (!context.accessToken) {
      throw new Error("Unauthorized: No access token provided");
    }

    // Verify token with DummyJSON
    const response = await fetch("https://dummyjson.com/auth/me", {
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized: Invalid token");
    }

    const user = await response.json();

    return next({
      context: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
    });
  });
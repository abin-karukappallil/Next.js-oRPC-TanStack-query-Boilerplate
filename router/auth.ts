import { pub } from "@/orpc";
import { type } from "arktype";

// Input schema for login
const loginInput = type({
  username: "string",
  password: "string",
});

// Output schema matching DummyJSON response
const loginOutput = type({
  id: "number",
  username: "string",
  email: "string",
  firstName: "string",
  lastName: "string",
  gender: "string",
  image: "string",
  accessToken: "string",
  refreshToken: "string",
});

export const loginHandler = pub
  .route({
    method: "POST",
    path: "/auth/login",
    summary: "User login via DummyJSON",
    tags: ["Auth"],
  })
  .input(loginInput)
  .output(loginOutput)
  .handler(async ({ input }) => {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: input.username,
        password: input.password,
        expiresInMins: 30,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    return data;
  });

// Get current user (requires token)
export const getMeHandler = pub
  .route({
    method: "GET",
    path: "/auth/me",
    summary: "Get current authenticated user",
    tags: ["Auth"],
  })
  .input(type({ token: "string" }))
  .output(
    type({
      id: "number",
      username: "string",
      email: "string",
      firstName: "string",
      lastName: "string",
    })
  )
  .handler(async ({ input }) => {
    const response = await fetch("https://dummyjson.com/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${input.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    return response.json();
  });

// Refresh token handler
export const refreshTokenHandler = pub
  .route({
    method: "POST",
    path: "/auth/refresh",
    summary: "Refresh access token",
    tags: ["Auth"],
  })
  .input(type({ refreshToken: "string" }))
  .output(type({ accessToken: "string", refreshToken: "string" }))
  .handler(async ({ input }) => {
    const response = await fetch("https://dummyjson.com/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: input.refreshToken,
        expiresInMins: 30,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return response.json();
  });
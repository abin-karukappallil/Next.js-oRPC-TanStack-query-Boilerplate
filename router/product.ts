import {pub} from "@/orpc";
import { type } from "arktype";

export const authHandler = pub
  .route({
    method: "POST",
    path: "/auth/login",
    summary: "User login",
    tags: ["Auth"],
  })
  .input(
    type({
      email: "string.email",
      password: "string",
    })
  )
  .output(
    type({
      token: "string",
    })
  )
  .handler(async ({ input }) => {
    if (input.email === "admin@test.com" && input.password === "1234") {
      return { token: "fake-jwt-token" };
    }

    throw new Error("Invalid credentials");
  });
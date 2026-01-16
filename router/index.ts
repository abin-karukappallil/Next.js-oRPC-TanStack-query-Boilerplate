// ...existing code...
import { echoHandler } from "./getting";
import { loginHandler, getMeHandler, refreshTokenHandler } from "./auth";

export const router = {
  echoHandler,
  // Auth routes
  login: loginHandler,
  getMe: getMeHandler,
  refreshToken: refreshTokenHandler,
};
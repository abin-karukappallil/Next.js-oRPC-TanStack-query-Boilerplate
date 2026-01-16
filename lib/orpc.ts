import type { router } from "@/router";
import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BatchLinkPlugin } from "@orpc/client/plugins";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: `${
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"
  }/rpc`,
  plugins: [
    new BatchLinkPlugin({
      groups: [
        {
          condition: () => true,
          context: {},
        },
      ],
    }),
  ],
  // Add headers dynamically for each request
  headers: () => {
    if (typeof window === "undefined") return {};

    const stored = localStorage.getItem("auth_state");
    if (stored) {
      try {
        const { accessToken } = JSON.parse(stored);
        if (accessToken) {
          return { Authorization: `Bearer ${accessToken}` };
        }
      } catch {
        return {};
      }
    }
    return {};
  },
});

export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalThis.$client = client;
}
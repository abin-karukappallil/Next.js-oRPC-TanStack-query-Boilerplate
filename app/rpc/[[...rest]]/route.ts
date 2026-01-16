import { router } from "@/router";
import { RPCHandler } from "@orpc/server/fetch";

const handler = new RPCHandler(router);

async function handleRequest(request: Request) {
  // Extract access token from Authorization header
  const authHeader = request.headers.get("Authorization");
  const accessToken = authHeader?.replace("Bearer ", "") || undefined;

  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: ({ accessToken } as any), // Pass token to context for auth middleware
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
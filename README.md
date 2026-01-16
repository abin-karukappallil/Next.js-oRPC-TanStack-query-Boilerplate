# Next.js oRPC + TanStack Query Boilerplate

A type-safe full-stack Next.js boilerplate with oRPC for API calls, TanStack Query for server state management, Better Auth for authentication, and Drizzle ORM for database access.

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **API Layer** | [oRPC](https://orpc.unnoq.com/) - Type-safe RPC |
| **State Management** | [TanStack Query](https://tanstack.com/query) v5 |
| **Authentication** | [Better Auth](https://better-auth.com/) + DummyJSON API |
| **Database ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Validation** | [ArkType](https://arktype.io/) |
| **Database** | PostgreSQL |
| **Styling** | Tailwind CSS |

## 📁 Project Structure

```
test-orpc/
├── app/                        # Next.js App Router
│   ├── api/auth/[...all]/     # Better Auth API routes
│   ├── login/                 # Login page
│   ├── rpc/[[...rest]]/       # oRPC catch-all handler
│   ├── providers.tsx          # TanStack Query Provider
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
│
├── lib/                        # Core utilities
│   ├── auth.ts                # Better Auth configuration
│   ├── auth-store.ts          # Client-side token storage
│   ├── orpc.ts                # oRPC client setup
│   └── orpc.server.ts         # oRPC server procedures
│
├── middlewares/               # oRPC middlewares
│   ├── auth.ts                # Authentication middleware
│   ├── db.ts                  # Database provider middleware
│   └── retry.ts               # Retry logic middleware
│
├── hooks/                     # React hooks
│   └── use-auth.ts            # Auth hooks (login, logout, user)
│
├── routers/                   # oRPC route handlers
│   └── auth.ts                # Auth handlers (DummyJSON)
│
├── db/                        # Drizzle database setup
│
└── router.ts                  # Main oRPC router
```

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/abin-karukappallil/Next.js-oRPC-TanStack-query-Boilerplate
cd Next.js-oRPC-TanStack-query-Boilerplate

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations (if applicable)
pnpm db:migrate

# Start development server
pnpm dev
```

## 🔐 Authentication

This boilerplate includes two authentication methods:

### 1. DummyJSON API (Development/Demo)

Uses the [DummyJSON Auth API](https://dummyjson.com/docs/auth) for testing:

```ts
// Test credentials
username: "emilys"
password: "emilyspass"
```

### 2. Better Auth (Production)

Configured with Drizzle adapter for PostgreSQL. Update `lib/auth.ts` for production use.

## 📡 API Usage

### Creating a Public Procedure

```ts
// routers/example.ts
import { pub } from "@/lib/orpc.server";
import { type } from "arktype";

export const helloHandler = pub
  .route({
    method: "GET",
    path: "/hello",
    summary: "Say hello",
  })
  .input(type({ name: "string" }))
  .output(type({ message: "string" }))
  .handler(async ({ input }) => {
    return { message: `Hello, ${input.name}!` };
  });
```

### Creating a Protected Procedure

```ts
// routers/protected.ts
import { protectedProcedure } from "@/lib/orpc.server";
import { type } from "arktype";

export const secretHandler = protectedProcedure
  .route({
    method: "GET",
    path: "/secret",
  })
  .output(type({ data: "string" }))
  .handler(async ({ context }) => {
    // context.user is available here
    return { data: `Secret for ${context.user.username}` };
  });
```

### Calling APIs from Client

```tsx
"use client";

import { client } from "@/lib/orpc";
import { useQuery, useMutation } from "@tanstack/react-query";

// Query example
const { data } = useQuery({
  queryKey: ["hello"],
  queryFn: () => client.hello({ name: "World" }),
});

// Mutation example
const mutation = useMutation({
  mutationFn: (data) => client.createPost(data),
});
```

## 🪝 Auth Hooks

```tsx
import { useLogin, useLogout, useAuth, useUser } from "@/hooks/use-auth";

function MyComponent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const handleLogin = () => {
    loginMutation.mutate({ username: "emilys", password: "emilyspass" });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };
}
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📜 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Drizzle Studio
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   React     │  │  TanStack   │  │    Auth Store       │  │
│  │ Components  │──│   Query     │──│  (localStorage)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                                   │
│         └────────────────┼───────────────────────────────────┤
│                          ▼                                   │
│                   ┌─────────────┐                            │
│                   │ oRPC Client │                            │
│                   └─────────────┘                            │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP + Auth Headers
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        Server                                │
│                   ┌─────────────┐                            │
│                   │ oRPC Handler│                            │
│                   └─────────────┘                            │
│                          │                                   │
│         ┌────────────────┼────────────────┐                  │
│         ▼                ▼                ▼                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │    Auth     │  │     DB      │  │   Retry     │          │
│  │ Middleware  │  │ Middleware  │  │ Middleware  │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│         │                │                                   │
│         ▼                ▼                                   │
│  ┌─────────────┐  ┌─────────────┐                            │
│  │   Routers   │  │   Drizzle   │                            │
│  │  (Handlers) │  │     ORM     │                            │
│  └─────────────┘  └─────────────┘                            │
│                          │                                   │
│                          ▼                                   │
│                   ┌─────────────┐                            │
│                   │ PostgreSQL  │                            │
│                   └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Resources

- [oRPC Documentation](https://orpc.unnoq.com/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Better Auth Docs](https://better-auth.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [ArkType Docs](https://arktype.io/)
- [Next.js Docs](https://nextjs.org/docs)

## 📄 License

MIT License - feel free to use this boilerplate for your projects.

---

Built with ❤️ using Next.js, oRPC, and TanStack Query

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "livreiro",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("books router", () => {
  it("should list books", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    const books = await caller.books.list();
    expect(Array.isArray(books)).toBe(true);
  });

  it("should get book by id", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    // Test with a non-existent book
    const book = await caller.books.getById({ id: 9999 });
    expect(book).toBeNull();
  });
});

describe("favorites router", () => {
  it("should list favorites for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const favorites = await caller.favorites.list();
    expect(Array.isArray(favorites)).toBe(true);
  });

  it("should check if book is favorite", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const isFav = await caller.favorites.isFavorite({ bookId: 1 });
    expect(typeof isFav).toBe("boolean");
  });
});

describe("sebos router", () => {
  it("should get sebos by user id", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const sebos = await caller.sebos.getByUserId();
    expect(Array.isArray(sebos)).toBe(true);
  });
});

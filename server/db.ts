import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, books, sebos, favorites, Book } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Funções para Sebos
export async function createSebo(seboData: {
  userId: number;
  name: string;
  description?: string;
  whatsapp: string;
  city?: string;
  state?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(sebos).values(seboData);
}

export async function getSebosByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(sebos).where(eq(sebos.userId, userId));
}

export async function getSeboById(seboId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(sebos).where(eq(sebos.id, seboId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Funções para Livros
export async function createBook(bookData: {
  seboId: number;
  title: string;
  author?: string;
  isbn?: string;
  category?: string;
  description?: string;
  price: string | number;
  condition?: "Excelente" | "Bom estado" | "Usado" | "Desgastado";
  pages?: number;
  year?: number;
  coverUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(books).values({
    ...bookData,
    price: String(bookData.price),
  });
}

export async function getBooksBySeboId(seboId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(books).where(eq(books.seboId, seboId));
}

export async function getBookById(bookId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllBooks(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(books).limit(limit).offset(offset);
}

export async function updateBook(bookId: number, updates: Partial<Book>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(books).set(updates).where(eq(books.id, bookId));
}

export async function deleteBook(bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(books).where(eq(books.id, bookId));
}

// Funções para Favoritos
export async function addFavorite(userId: number, bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(favorites).values({ userId, bookId });
}

export async function removeFavorite(userId: number, bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(favorites).where(
    and(eq(favorites.userId, userId), eq(favorites.bookId, bookId))
  );
}

export async function getFavoritesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(favorites).where(eq(favorites.userId, userId));
}

export async function isFavorite(userId: number, bookId: number) {
  const db = await getDb();
  if (!db) return false;

  const result = await db.select().from(favorites).where(
    and(eq(favorites.userId, userId), eq(favorites.bookId, bookId))
  ).limit(1);

  return result.length > 0;
}

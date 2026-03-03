import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  books: router({
    list: publicProcedure.query(() => db.getAllBooks()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
      db.getBookById(input.id)
    ),
    create: protectedProcedure
      .input(z.object({
        seboId: z.number(),
        title: z.string(),
        author: z.string().optional(),
        isbn: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        price: z.number(),
        condition: z.enum(["Excelente", "Bom estado", "Usado", "Desgastado"]).optional(),
        pages: z.number().optional(),
        year: z.number().optional(),
        coverUrl: z.string().optional(),
      }))
      .mutation(({ input }) => db.createBook(input)),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        price: z.string().optional(),
        condition: z.enum(["Excelente", "Bom estado", "Usado", "Desgastado"]).optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...updates } = input;
        return db.updateBook(id, updates as any);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteBook(input.id)),
  }),

  sebos: router({
    getByUserId: protectedProcedure.query(({ ctx }) =>
      db.getSebosByUserId(ctx.user.id)
    ),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
      db.getSeboById(input.id)
    ),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        whatsapp: z.string(),
        city: z.string().optional(),
        state: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => db.createSebo({
        userId: ctx.user.id,
        ...input,
      })),
  }),

  favorites: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getFavoritesByUserId(ctx.user.id)
    ),
    add: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .mutation(({ input, ctx }) => db.addFavorite(ctx.user.id, input.bookId)),
    remove: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .mutation(({ input, ctx }) => db.removeFavorite(ctx.user.id, input.bookId)),
    isFavorite: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .query(({ input, ctx }) => db.isFavorite(ctx.user.id, input.bookId)),
  }),
});

export type AppRouter = typeof appRouter;

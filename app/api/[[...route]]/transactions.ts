import { z } from "zod";
import { Hono } from "hono";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { parse, subDays } from "date-fns";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, inArray, lte, not, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
  categories,
  transactions,
  inserTransactionSchema,
  accounts,
} from "@/db/schema";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      // Parse dates and handle invalid formats
      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return c.json({ error: "Invalid date format" }, 400);
      }

      const data = await db
        .select({
          id: transactions.id,
          category: categories.name,
          categoryId: transactions.categoryId,
          date: transactions.date,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id)) // Ensure correct relationship
        .leftJoin(categories, eq(transactions.categoryId, categories.id)) // Keep left join for optional categories
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    }
  )
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const id = c.req.valid("param").id;

      if (!id) {
        return c.json({ error: "Invalid id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: transactions.id,
          categoryId: transactions.categoryId,
          date: transactions.date,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id)) // Fix join here
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));

      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", inserTransactionSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Verify account belongs to user
      const [account] = await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.id, values.accountId),
            eq(accounts.userId, auth.userId)
          )
        );

      if (!account) {
        return c.json({ error: "Account not found" }, 404);
      }

      // Remove categoryId if it's an empty string or undefined
      const transactionData = {
        id: createId(),
        ...values,
        categoryId: values.categoryId || null,  // Convert empty string/undefined to null
      };


      const [data] = await db
        .insert(transactions)
        .values(transactionData)
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-update",
    clerkMiddleware(),
    zValidator("json", z.array(inserTransactionSchema.omit({ id: true }))),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            ...value,
            id: createId(),
          }))
        )
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string().min(1)), // Ensure the array contains at least one ID
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionsToDelete = db.$with("transaction_to_delete").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId)
            )
          ) // Ensure valid userId check
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(SELECT id FROM ${transactionsToDelete})`
          )
        )
        .returning({ id: transactions.id });

      return c.json({ data });
    }
  )
 // ... existing code ...
 .patch(
  "/:id",
  clerkMiddleware(),
  zValidator("param", z.object({ id: z.string().optional() })),
  zValidator("json", inserTransactionSchema.omit({ id: true })),
  async (c) => {
    const auth = getAuth(c);
    const id = c.req.valid("param").id;
    const values = c.req.valid("json");

    if (!id) {
      return c.json({ error: "Invalid id" }, 400);
    }

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // First verify the transaction belongs to the user
    const [existingTransaction] = await db
      .select()
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId)
        )
      );

    if (!existingTransaction) {
      return c.json({ error: "Transaction not found" }, 404);
    }

    // Then verify the new account belongs to the user
    const [newAccount] = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.id, values.accountId),
          eq(accounts.userId, auth.userId)
        )
      );

    if (!newAccount) {
      return c.json({ error: "New account not found" }, 404);
    }

    const [data] = await db
      .update(transactions)
      .set(values)
      .where(eq(transactions.id, id))
      .returning();

    if (!data) {
      return c.json({ error: "Failed to update transaction" }, 404);
    }

    return c.json({ data });
  }
)
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const id = c.req.valid("param").id;

      if (!id) {
        return c.json({ error: "Invalid id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionToDelete = db.$with("transaction_to_delete").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );

      const [data] = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(SELECT id FROM ${transactionToDelete})`)
        )
        .returning({ id: transactions.id });

      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data });
    }
  );
export default app;

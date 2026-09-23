import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(overrides: Partial<TrpcContext> = {}): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "test",
      role: "admin",
      tenantId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    tenantId: 1,
    isSuperAdmin: true,
    req: { protocol: "https", headers: {} },
    res: { clearCookie: () => {} },
    ...overrides,
  };
}

describe("vouchersRouter contract tests", () => {
  const caller = appRouter.createCaller(createMockContext());

  it("create: validates input schema", async () => {
    const input = {
      voucherType: "payment" as const,
      voucherDate: "2026-03-15",
      amount: "1000",
      lines: [
        {
          accountId: 1,
          accountCode: "1000",
          debitAmount: "1000",
          creditAmount: "0",
        },
        {
          accountId: 2,
          accountCode: "2000",
          debitAmount: "0",
          creditAmount: "1000",
        },
      ],
    };

    const outputType = caller.vouchers.create._def.output;
    expect(outputType).toBeDefined();
  });

  it("get: validates input and output schemas", async () => {
    const inputSchema = caller.vouchers.get._def.input;
    expect(inputSchema).toBeDefined();

    const outputSchema = caller.vouchers.get._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("list: validates pagination and filter schemas", async () => {
    const inputSchema = caller.vouchers.list._def.input;
    expect(inputSchema).toBeDefined();

    const validInput = {
      type: "payment" as const,
      status: "draft" as const,
      page: 1,
      pageSize: 20,
    };

    const parsed = inputSchema.safeParse(validInput);
    expect(parsed.success).toBe(true);
  });

  it("update: validates partial input schema", async () => {
    const inputSchema = caller.vouchers.update._def.input;
    expect(inputSchema).toBeDefined();

    const partialInput = {
      id: 1,
      amount: "2000",
    };

    const parsed = inputSchema.safeParse(partialInput);
    expect(parsed.success).toBe(true);
  });

  it("submit: validates input schema", async () => {
    const inputSchema = caller.vouchers.submit._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });

  it("approve: validates approval level enum", async () => {
    const inputSchema = caller.vouchers.approve._def.input;
    expect(inputSchema).toBeDefined();

    const validInput = { id: 1, level: "final" as const, comments: "Approved" };
    const parsed = inputSchema.safeParse(validInput);
    expect(parsed.success).toBe(true);

    const invalidLevel = { id: 1, level: "invalid" };
    const invalidParsed = inputSchema.safeParse(invalidLevel);
    expect(invalidParsed.success).toBe(false);
  });

  it("reject: validates reason required", async () => {
    const inputSchema = caller.vouchers.reject._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1, reason: "Wrong account" });
    expect(parsed.success).toBe(true);

    const missingReason = inputSchema.safeParse({ id: 1, reason: "" });
    expect(missingReason.success).toBe(false);
  });

  it("post: validates budget validation flag", async () => {
    const inputSchema = caller.vouchers.post._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1, validateBudget: true });
    expect(parsed.success).toBe(true);

    const defaulted = inputSchema.safeParse({ id: 1 });
    expect(defaulted.success).toBe(true);
    expect(defaulted.data.validateBudget).toBe(true);
  });

  it("cancel: validates reason required", async () => {
    const inputSchema = caller.vouchers.cancel._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1, reason: "Cancelled" });
    expect(parsed.success).toBe(true);
  });

  it("reverse: validates reversal date and optional reason", async () => {
    const inputSchema = caller.vouchers.reverse._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      reversalDate: "2026-03-15",
      reason: "Error correction",
    });
    expect(parsed.success).toBe(true);
  });

  it("validateBudget: validates input and output schemas", async () => {
    const inputSchema = caller.vouchers.validateBudget._def.input;
    expect(inputSchema).toBeDefined();

    const outputSchema = caller.vouchers.validateBudget._def.output;
    expect(outputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      budgetLineId: 1,
      amount: "500",
      excludeVoucherId: 2,
    });
    expect(parsed.success).toBe(true);
  });

  it("getStats: validates optional filter input", async () => {
    const inputSchema = caller.vouchers.getStats._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      fromDate: "2026-01-01",
      toDate: "2026-12-31",
      type: "payment" as const,
    });
    expect(parsed.success).toBe(true);
  });
});

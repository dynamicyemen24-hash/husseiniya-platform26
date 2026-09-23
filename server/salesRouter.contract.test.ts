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

describe("quotationRouter contract tests", () => {
  const caller = appRouter.createCaller(createMockContext());

  it("types.list: validates output schema", async () => {
    const outputSchema = caller.quotation.types.list._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("types.create: validates input schema", async () => {
    const inputSchema = caller.quotation.types.create._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      code: "CUSTOM",
      name: "Custom Type",
      direction: "sale",
      itemKinds: ["product"],
      numberingPrefix: "QT-C",
    });
    expect(parsed.success).toBe(true);
  });

  it("list: validates pagination and filter input", async () => {
    const inputSchema = caller.quotation.list._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      direction: "sale",
      status: "draft",
      search: "test",
      limit: 50,
      offset: 0,
    });
    expect(parsed.success).toBe(true);
  });

  it("get: validates id input", async () => {
    const inputSchema = caller.quotation.get._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });

  it("create: validates complex line and party schemas", async () => {
    const inputSchema = caller.quotation.create._def.input;
    expect(inputSchema).toBeDefined();

    const validInput = {
      direction: "sale" as const,
      customerId: 1,
      lines: [
        {
          kind: "product" as const,
          refId: 1,
          name: "Product",
          quantity: 10,
          unit: "pcs",
          unitPrice: 100,
          costPrice: 60,
          discountPct: 5,
          taxPct: 0,
        },
      ],
      parties: [
        {
          role: "customer" as const,
          entityType: "customer",
          entityId: 1,
          name: "Customer",
        },
      ],
      validityDays: 30,
    };

    const parsed = inputSchema.safeParse(validInput);
    expect(parsed.success).toBe(true);

    const emptyLines = inputSchema.safeParse({ ...validInput, lines: [] });
    expect(emptyLines.success).toBe(false);

    const negativeQuantity = inputSchema.safeParse({
      ...validInput,
      lines: [{ ...validInput.lines[0], quantity: -1 }],
    });
    expect(negativeQuantity.success).toBe(false);
  });

  it("update: validates partial input with changeSummary", async () => {
    const inputSchema = caller.quotation.update._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      notes: "Updated notes",
      changeSummary: "Updated terms",
    });
    expect(parsed.success).toBe(true);
  });

  it("transition: validates state machine transitions", async () => {
    const inputSchema = caller.quotation.transition._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      to: "in_review",
      comment: "Ready for review",
    });
    expect(parsed.success).toBe(true);
  });

  it("decideApproval: validates approval decision", async () => {
    const inputSchema = caller.quotation.decideApproval._def.input;
    expect(inputSchema).toBeDefined();

    const approve = inputSchema.safeParse({
      approvalId: 1,
      approve: true,
      comment: "Approved",
    });
    expect(approve.success).toBe(true);

    const reject = inputSchema.safeParse({
      approvalId: 1,
      approve: false,
      comment: "Rejected",
    });
    expect(reject.success).toBe(true);
  });

  it("negotiate: validates negotiation round input", async () => {
    const inputSchema = caller.quotation.negotiate._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      side: "us",
      message: "Counter-offer",
      proposedTotal: 9500,
    });
    expect(parsed.success).toBe(true);

    const invalidSide = inputSchema.safeParse({
      id: 1,
      side: "invalid",
      message: "Test",
    });
    expect(invalidSide.success).toBe(false);
  });

  it("analyze: validates id input", async () => {
    const inputSchema = caller.quotation.analyze._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });
});

describe("posRouter contract tests", () => {
  const caller = appRouter.createCaller(createMockContext());

  it("createSale: validates sale input with idempotency key", async () => {
    const inputSchema = caller.pos.createSale._def.input;
    expect(inputSchema).toBeDefined();

    const validInput = {
      customerId: 1,
      items: [{ productId: 1, quantity: 2, discount: 0 }],
      paymentMethod: "cash",
      idempotencyKey: "test-key-123",
    };
    const parsed = inputSchema.safeParse(validInput);
    expect(parsed.success).toBe(true);

    const emptyItems = inputSchema.safeParse({ ...validInput, items: [] });
    expect(emptyItems.success).toBe(false);

    const zeroQuantity = inputSchema.safeParse({
      ...validInput,
      items: [{ productId: 1, quantity: 0 }],
    });
    expect(zeroQuantity.success).toBe(false);
  });

  it("editSale: validates partial edit input", async () => {
    const inputSchema = caller.pos.editSale._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      invoiceId: 1,
      paymentMethod: "card",
      notes: "Updated",
    });
    expect(parsed.success).toBe(true);
  });

  it("voidSale: validates invoice id", async () => {
    const inputSchema = caller.pos.voidSale._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ invoiceId: 1 });
    expect(parsed.success).toBe(true);
  });

  it("printReceipt: validates invoice number", async () => {
    const inputSchema = caller.pos.printReceipt._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ invoiceNumber: "POS-ABC123" });
    expect(parsed.success).toBe(true);
  });

  it("holdRecall: validates invoice id", async () => {
    const inputSchema = caller.pos.holdRecall._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ invoiceId: 1 });
    expect(parsed.success).toBe(true);
  });

  it("discounts: validates discount amount", async () => {
    const inputSchema = caller.pos.discounts._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      invoiceId: 1,
      discountAmount: "100.00",
    });
    expect(parsed.success).toBe(true);

    const negativeDiscount = inputSchema.safeParse({
      invoiceId: 1,
      discountAmount: "-50",
    });
    expect(negativeDiscount.success).toBe(false);
  });

  it("returns: validates return items and reason", async () => {
    const inputSchema = caller.pos.returns._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      invoiceId: 1,
      reason: "Defective",
      items: [{ productId: 1, quantity: 1 }],
    });
    expect(parsed.success).toBe(true);

    const shortReason = inputSchema.safeParse({
      invoiceId: 1,
      reason: "X",
      items: [{ productId: 1, quantity: 1 }],
    });
    expect(shortReason.success).toBe(false);

    const emptyItems = inputSchema.safeParse({
      invoiceId: 1,
      reason: "Test",
      items: [],
    });
    expect(emptyItems.success).toBe(false);
  });
});

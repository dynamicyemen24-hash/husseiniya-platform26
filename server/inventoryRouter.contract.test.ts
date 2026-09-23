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

describe("inventoryRouter contract tests", () => {
  const caller = appRouter.createCaller(createMockContext());

  it("list: validates pagination input", async () => {
    const inputSchema = caller.inventory.list._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ limit: 100, offset: 0 });
    expect(parsed.success).toBe(true);

    const invalidLimit = inputSchema.safeParse({ limit: 600 });
    expect(invalidLimit.success).toBe(false);

    const negativeOffset = inputSchema.safeParse({ offset: -1 });
    expect(negativeOffset.success).toBe(false);
  });

  it("view: validates id input", async () => {
    const inputSchema = caller.inventory.view._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });

  it("create: validates required fields", async () => {
    const inputSchema = caller.inventory.create._def.input;
    expect(inputSchema).toBeDefined();

    const validInput = {
      code: "PROD001",
      name: "Test Product",
      type: "goods" as const,
      salePrice: "100",
      purchasePrice: "60",
      currentStock: 0,
      minStock: 10,
      unitId: 1,
      isActive: true,
    };

    const parsed = inputSchema.safeParse(validInput);
    expect(parsed.success).toBe(true);

    const missingCode = inputSchema.safeParse({ ...validInput, code: "" });
    expect(missingCode.success).toBe(false);

    const invalidType = inputSchema.safeParse({
      ...validInput,
      type: "invalid",
    });
    expect(invalidType.success).toBe(false);
  });

  it("edit: validates partial update and forbids currentStock", async () => {
    const inputSchema = caller.inventory.edit._def.input;
    expect(inputSchema).toBeDefined();

    const validInput = {
      id: 1,
      name: "Updated Name",
      salePrice: "150",
    };

    const parsed = inputSchema.safeParse(validInput);
    expect(parsed.success).toBe(true);

    const withStock = inputSchema.safeParse({
      ...validInput,
      currentStock: 100,
    });
    expect(withStock.success).toBe(false);
  });

  it("delete: validates id input", async () => {
    const inputSchema = caller.inventory.delete._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });

  it("adjustStock: validates adjustment types", async () => {
    const inputSchema = caller.inventory.adjustStock._def.input;
    expect(inputSchema).toBeDefined();

    const addInput = {
      productId: 1,
      warehouseId: 1,
      quantity: 10,
      type: "add" as const,
    };
    const parsed = inputSchema.safeParse(addInput);
    expect(parsed.success).toBe(true);

    const removeInput = { ...addInput, type: "remove" as const };
    const parsedRemove = inputSchema.safeParse(removeInput);
    expect(parsedRemove.success).toBe(true);

    const setInput = { ...addInput, type: "set" as const };
    const parsedSet = inputSchema.safeParse(setInput);
    expect(parsedSet.success).toBe(true);

    const invalidType = inputSchema.safeParse({ ...addInput, type: "invalid" });
    expect(invalidType.success).toBe(false);

    const zeroQuantity = inputSchema.safeParse({ ...addInput, quantity: 0 });
    expect(zeroQuantity.success).toBe(false);
  });

  it("physicalCount: validates counted quantity", async () => {
    const inputSchema = caller.inventory.physicalCount._def.input;
    expect(inputSchema).toBeDefined();

    const validInput = {
      productId: 1,
      warehouseId: 1,
      countedQty: 50,
    };
    const parsed = inputSchema.safeParse(validInput);
    expect(parsed.success).toBe(true);

    const negativeQty = inputSchema.safeParse({
      ...validInput,
      countedQty: -1,
    });
    expect(negativeQty.success).toBe(false);
  });
});

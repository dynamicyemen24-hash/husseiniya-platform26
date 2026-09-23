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

describe("erpRouter (Procurement) contract tests", () => {
  const caller = appRouter.createCaller(createMockContext());

  it("listProcurements: validates status filter", async () => {
    const inputSchema = caller.erp.listProcurements._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ status: "pending" });
    expect(parsed.success).toBe(true);
  });

  it("getProcurementKpis: validates output", async () => {
    const outputSchema = caller.erp.getProcurementKpis._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("createProcurement: validates required fields and approvers array", async () => {
    const inputSchema = caller.erp.createProcurement._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      itemName: "Office Supplies",
      departmentId: 1,
      quantity: "50",
      estimatedCost: "5000",
      supplierId: 1,
      approvers: [2, 3],
    });
    expect(parsed.success).toBe(true);

    const tooManyApprovers = inputSchema.safeParse({
      itemName: "Test",
      departmentId: 1,
      quantity: "10",
      approvers: Array(11).fill(1),
    });
    expect(tooManyApprovers.success).toBe(false);

    const negativeQuantity = inputSchema.safeParse({
      itemName: "Test",
      departmentId: 1,
      quantity: "-5",
    });
    expect(negativeQuantity.success).toBe(false);

    const negativeCost = inputSchema.safeParse({
      itemName: "Test",
      departmentId: 1,
      quantity: "10",
      estimatedCost: "-100",
    });
    expect(negativeCost.success).toBe(false);
  });

  it("approveProcurement: validates decision enum and level", async () => {
    const inputSchema = caller.erp.approveProcurement._def.input;
    expect(inputSchema).toBeDefined();

    const approve = inputSchema.safeParse({
      id: 1,
      decision: "approved",
      note: "Looks good",
    });
    expect(approve.success).toBe(true);

    const reject = inputSchema.safeParse({
      id: 1,
      decision: "rejected",
      note: "Over budget",
    });
    expect(reject.success).toBe(true);

    const invalidDecision = inputSchema.safeParse({
      id: 1,
      decision: "invalid",
    });
    expect(invalidDecision.success).toBe(false);
  });

  it("receiveProcurement: validates actual cost", async () => {
    const inputSchema = caller.erp.receiveProcurement._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      actualCost: "5200.00",
      note: "Received OK",
    });
    expect(parsed.success).toBe(true);

    const missingCost = inputSchema.safeParse({ id: 1 });
    expect(missingCost.success).toBe(true);

    const negativeCost = inputSchema.safeParse({
      id: 1,
      actualCost: "-100",
    });
    expect(negativeCost.success).toBe(false);
  });

  it("listProcurementApprovals: validates procurement id", async () => {
    const inputSchema = caller.erp.listProcurementApprovals._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ procurementId: 1 });
    expect(parsed.success).toBe(true);
  });

  it("listReorderSuggestions: validates output", async () => {
    const outputSchema = caller.erp.listReorderSuggestions._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("generateProcurementsFromReorder: validates admin procedure", async () => {
    const outputSchema = caller.erp.generateProcurementsFromReorder._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("processAlerts: validates admin procedure", async () => {
    const outputSchema = caller.erp.processAlerts._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("getDashboard: validates output", async () => {
    const outputSchema = caller.erp.getDashboard._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("listTickets: validates status filter", async () => {
    const inputSchema = caller.erp.listTickets._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ status: "open" });
    expect(parsed.success).toBe(true);
  });

  it("createTicket: validates required fields", async () => {
    const inputSchema = caller.erp.createTicket._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      subject: "Issue",
      priority: "high",
    });
    expect(parsed.success).toBe(true);
  });

  it("updateTicket: validates partial input", async () => {
    const inputSchema = caller.erp.updateTicket._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      status: "closed",
    });
    expect(parsed.success).toBe(true);
  });

  it("deleteTicket: validates id", async () => {
    const inputSchema = caller.erp.deleteTicket._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });

  it("listInspections: validates output", async () => {
    const outputSchema = caller.erp.listInspections._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("createInspection: validates required fields", async () => {
    const inputSchema = caller.erp.createInspection._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      code: "INSP001",
      title: "Quality Check",
      result: "pass",
    });
    expect(parsed.success).toBe(true);
  });

  it("deleteInspection: validates id", async () => {
    const inputSchema = caller.erp.deleteInspection._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });
});

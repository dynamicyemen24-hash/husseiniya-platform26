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

describe("erpRouter (HR) contract tests", () => {
  const caller = appRouter.createCaller(createMockContext());

  it("listDepartments: validates output", async () => {
    const outputSchema = caller.erp.listDepartments._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("createDepartment: validates input schema", async () => {
    const inputSchema = caller.erp.createDepartment._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      code: "DEPT001",
      name: "Department",
      isActive: true,
    });
    expect(parsed.success).toBe(true);

    const missingCode = inputSchema.safeParse({ name: "Dept" });
    expect(missingCode.success).toBe(false);
  });

  it("updateDepartment: validates partial input", async () => {
    const inputSchema = caller.erp.updateDepartment._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      name: "Updated",
      isActive: false,
    });
    expect(parsed.success).toBe(true);
  });

  it("deleteDepartment: validates id", async () => {
    const inputSchema = caller.erp.deleteDepartment._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });

  it("listEmployees: validates filter input", async () => {
    const inputSchema = caller.erp.listEmployees._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      search: "Ahmed",
      status: "active",
    });
    expect(parsed.success).toBe(true);
  });

  it("createEmployee: validates required fields", async () => {
    const inputSchema = caller.erp.createEmployee._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      code: "EMP001",
      fullName: "Ahmed Ali",
      jobTitle: "Accountant",
      salary: "50000",
      status: "active",
    });
    expect(parsed.success).toBe(true);

    const missingCode = inputSchema.safeParse({
      fullName: "Test",
      jobTitle: "Dev",
    });
    expect(missingCode.success).toBe(false);
  });

  it("updateEmployee: validates partial input", async () => {
    const inputSchema = caller.erp.updateEmployee._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      salary: "55000",
      status: "active",
    });
    expect(parsed.success).toBe(true);
  });

  it("deleteEmployee: validates id", async () => {
    const inputSchema = caller.erp.deleteEmployee._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });

  it("listAttendance: validates date range and employee filter", async () => {
    const inputSchema = caller.erp.listAttendance._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      from: "2026-03-01",
      to: "2026-03-31",
      employeeId: 1,
    });
    expect(parsed.success).toBe(true);
  });

  it("createAttendance: validates status and date", async () => {
    const inputSchema = caller.erp.createAttendance._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      employeeId: 1,
      date: "2026-03-15",
      status: "present",
      checkIn: "2026-03-15T08:00:00",
      checkOut: "2026-03-15T16:00:00",
    });
    expect(parsed.success).toBe(true);
  });

  it("listPayrollRuns: validates output", async () => {
    const outputSchema = caller.erp.listPayrollRuns._def.output;
    expect(outputSchema).toBeDefined();
  });

  it("createPayrollRun: validates period dates", async () => {
    const inputSchema = caller.erp.createPayrollRun._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      periodName: "2026-03",
      fromDate: "2026-03-01",
      toDate: "2026-03-31",
    });
    expect(parsed.success).toBe(true);
  });
});

describe("erpRouter (Projects) contract tests", () => {
  const caller = appRouter.createCaller(createMockContext());

  it("listProjects: validates status filter", async () => {
    const inputSchema = caller.erp.listProjects._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ status: "active" });
    expect(parsed.success).toBe(true);
  });

  it("createProject: validates required fields", async () => {
    const inputSchema = caller.erp.createProject._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      code: "PRJ001",
      name: "Project",
      status: "planning",
      budget: "100000",
    });
    expect(parsed.success).toBe(true);
  });

  it("updateProject: validates partial input with date handling", async () => {
    const inputSchema = caller.erp.updateProject._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      status: "active",
      budget: "150000",
      startDate: "2026-04-01",
    });
    expect(parsed.success).toBe(true);

    const nullDate = inputSchema.safeParse({
      id: 1,
      endDate: null,
    });
    expect(nullDate.success).toBe(true);
  });

  it("deleteProject: validates id", async () => {
    const inputSchema = caller.erp.deleteProject._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });

  it("listProjectMembers: validates project id", async () => {
    const inputSchema = caller.erp.listProjectMembers._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ projectId: 1 });
    expect(parsed.success).toBe(true);
  });

  it("listTasks: validates optional project id", async () => {
    const inputSchema = caller.erp.listTasks._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ projectId: 1 });
    expect(parsed.success).toBe(true);

    const noFilter = inputSchema.safeParse({});
    expect(noFilter.success).toBe(true);
  });

  it("createTask: validates required fields", async () => {
    const inputSchema = caller.erp.createTask._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      projectId: 1,
      title: "Task",
      status: "todo",
      priority: "medium",
    });
    expect(parsed.success).toBe(true);
  });

  it("updateTask: validates partial input", async () => {
    const inputSchema = caller.erp.updateTask._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      id: 1,
      status: "done",
      actualHours: "8",
    });
    expect(parsed.success).toBe(true);
  });

  it("deleteTask: validates id", async () => {
    const inputSchema = caller.erp.deleteTask._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });

  it("addProjectMember: validates employee and role", async () => {
    const inputSchema = caller.erp.addProjectMember._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({
      projectId: 1,
      employeeId: 1,
      roleInProject: "Developer",
    });
    expect(parsed.success).toBe(true);
  });

  it("removeProjectMember: validates id", async () => {
    const inputSchema = caller.erp.removeProjectMember._def.input;
    expect(inputSchema).toBeDefined();

    const parsed = inputSchema.safeParse({ id: 1 });
    expect(parsed.success).toBe(true);
  });
});

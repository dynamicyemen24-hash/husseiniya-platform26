/**
 * Workflow Automation Engine — Rule-based task automation.
 * Defines triggers, conditions, and actions to automate business processes.
 */

export type TriggerType =
  | "onCreate"
  | "onUpdate"
  | "onDelete"
  | "onFieldChange"
  | "onThreshold"
  | "onSchedule"
  | "onApproval";

export type ActionType =
  | "autoNumber"
  | "sendNotification"
  | "updateField"
  | "createDocument"
  | "approve"
  | "reject"
  | "logEvent"
  | "callAPI";

export interface WorkflowCondition {
  field: string;
  operator:
    | "equals"
    | "notEquals"
    | "greaterThan"
    | "lessThan"
    | "contains"
    | "isEmpty"
    | "isNotEmpty";
  value: unknown;
}

export interface WorkflowAction {
  type: ActionType;
  target?: string;
  value?: unknown;
  delay?: number; // milliseconds
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  entity: string; // e.g., "invoice", "voucher", "requisition"
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
  priority: number; // higher = executes first
  createdAt: Date;
}

export interface WorkflowExecutionResult {
  ruleId: string;
  ruleName: string;
  actionsExecuted: number;
  errors: string[];
  executedAt: Date;
  success: boolean;
}

/**
 * Central workflow engine that matches events to rules and executes actions.
 */
export class WorkflowEngine {
  private rules: WorkflowRule[] = [];
  private executionLog: WorkflowExecutionResult[] = [];
  private maxLogSize = 1000;

  /** Register a new workflow rule */
  addRule(rule: Omit<WorkflowRule, "id" | "createdAt">): string {
    const id = `wf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const fullRule: WorkflowRule = {
      ...rule,
      id,
      createdAt: new Date(),
    };
    this.rules.push(fullRule);
    this.rules.sort((a, b) => b.priority - a.priority);
    return id;
  }

  /** Remove a rule by ID */
  removeRule(id: string): boolean {
    const idx = this.rules.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.rules.splice(idx, 1);
    return true;
  }

  /** Get all enabled rules for an entity */
  getRulesForEntity(entity: string): WorkflowRule[] {
    return this.rules.filter(r => r.entity === entity && r.enabled);
  }

  /**
   * Evaluate conditions against a record.
   * Returns true if ALL conditions pass.
   */
  evaluateConditions(
    conditions: WorkflowCondition[],
    record: Record<string, unknown>
  ): boolean {
    return conditions.every(cond => {
      const fieldValue = record[cond.field];
      switch (cond.operator) {
        case "equals":
          return fieldValue === cond.value;
        case "notEquals":
          return fieldValue !== cond.value;
        case "greaterThan":
          return Number(fieldValue) > Number(cond.value);
        case "lessThan":
          return Number(fieldValue) < Number(cond.value);
        case "contains":
          return String(fieldValue ?? "").includes(String(cond.value));
        case "isEmpty":
          return (
            fieldValue === undefined || fieldValue === null || fieldValue === ""
          );
        case "isNotEmpty":
          return (
            fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
          );
        default:
          return false;
      }
    });
  }

  /**
   * Process an event against matching rules.
   * Returns execution results for all matched rules.
   */
  processEvent(
    trigger: TriggerType,
    entity: string,
    record: Record<string, unknown>
  ): WorkflowExecutionResult[] {
    const results: WorkflowExecutionResult[] = [];
    const matchingRules = this.getRulesForEntity(entity).filter(
      r => r.trigger === trigger
    );

    for (const rule of matchingRules) {
      const result = this.executeRule(rule, record);
      results.push(result);
      this.logExecution(result);
    }

    return results;
  }

  /** Execute a single rule's actions */
  private executeRule(
    rule: WorkflowRule,
    record: Record<string, unknown>
  ): WorkflowExecutionResult {
    const errors: string[] = [];
    let actionsExecuted = 0;

    try {
      if (!this.evaluateConditions(rule.conditions, record)) {
        return {
          ruleId: rule.id,
          ruleName: rule.name,
          actionsExecuted: 0,
          errors: ["Conditions not met"],
          executedAt: new Date(),
          success: true,
        };
      }

      for (const action of rule.actions) {
        try {
          if (action.delay) {
            setTimeout(() => this.executeAction(action, record), action.delay);
          } else {
            this.executeAction(action, record);
          }
          actionsExecuted++;
        } catch (err) {
          errors.push(`Action ${action.type} failed: ${String(err)}`);
        }
      }
    } catch (err) {
      errors.push(`Rule execution error: ${String(err)}`);
    }

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      actionsExecuted,
      errors,
      executedAt: new Date(),
      success: errors.length === 0,
    };
  }

  /** Execute a single action */
  private executeAction(
    action: WorkflowAction,
    record: Record<string, unknown>
  ): void {
    switch (action.type) {
      case "autoNumber":
        // Handled by the auto-number system
        break;
      case "sendNotification":
        // Handled by notification system
        break;
      case "updateField":
        if (action.target) {
          (record as Record<string, unknown>)[action.target] = action.value;
        }
        break;
      case "createDocument":
        // Handled by document creation system
        break;
      case "approve":
      case "reject":
        // Handled by approval system
        break;
      case "logEvent":
        console.warn(`[Workflow] ${action.target}:`, record);
        break;
      case "callAPI":
        // Handled by API call system
        break;
    }
  }

  /** Log execution result */
  private logExecution(result: WorkflowExecutionResult): void {
    this.executionLog.push(result);
    if (this.executionLog.length > this.maxLogSize) {
      this.executionLog.shift();
    }
  }

  /** Get execution log */
  getExecutionLog(): WorkflowExecutionResult[] {
    return [...this.executionLog];
  }

  /** Get statistics */
  getStats(): {
    totalRules: number;
    enabledRules: number;
    totalExecutions: number;
    successRate: number;
  } {
    const totalExecutions = this.executionLog.length;
    const successExecutions = this.executionLog.filter(r => r.success).length;
    return {
      totalRules: this.rules.length,
      enabledRules: this.rules.filter(r => r.enabled).length,
      totalExecutions,
      successRate:
        totalExecutions > 0 ? successExecutions / totalExecutions : 1,
    };
  }

  /** Clear execution log */
  clearLog(): void {
    this.executionLog = [];
  }
}

/**
 * Predefined workflow rules for common business scenarios.
 */
export function createDefaultWorkflows(engine: WorkflowEngine): void {
  // Auto-number on invoice creation
  engine.addRule({
    name: "ترقيم الفاتورة التلقائي",
    description: "يُنشئ رقم فاتورة تلقائي عند إنشاء فاتورة جديدة",
    trigger: "onCreate",
    entity: "invoice",
    conditions: [{ field: "status", operator: "equals", value: "draft" }],
    actions: [
      { type: "autoNumber", value: "INV" },
      { type: "updateField", target: "invoiceNumber", value: "AUTO" },
      { type: "logEvent", target: "invoice.created" },
    ],
    enabled: true,
    priority: 10,
  });

  // Auto-approve small invoices
  engine.addRule({
    name: "الموافقة التلقائية للفواتير الصغيرة",
    description: "يُوافق تلقائياً على الفواتير أقل من مبلغ معين",
    trigger: "onCreate",
    entity: "invoice",
    conditions: [
      { field: "amount", operator: "lessThan", value: 5000 },
      { field: "status", operator: "equals", value: "draft" },
    ],
    actions: [
      { type: "approve" },
      {
        type: "sendNotification",
        target: "customer",
        value: "تمت الموافقة التلقائية",
      },
    ],
    enabled: true,
    priority: 8,
  });

  // Low stock notification
  engine.addRule({
    name: "تنبيه المخزون المنخفض",
    description: "يرسل تنبيهاً عند انخفاض المخزون عن الحد الأدنى",
    trigger: "onFieldChange",
    entity: "product",
    conditions: [
      { field: "stockQty", operator: "lessThan", value: "reorderLevel" },
    ],
    actions: [
      { type: "sendNotification", target: "manager", value: "مخزون منخفض" },
      { type: "createDocument", target: "purchaseOrder" },
    ],
    enabled: true,
    priority: 9,
  });

  // Requisition auto-escalation
  engine.addRule({
    name: "تصعيد الطلبات المُعطّلة",
    description: "يُصعد الطلبات المُعطّلة لأكثر من 48 ساعة",
    trigger: "onSchedule",
    entity: "requisition",
    conditions: [{ field: "pendingHours", operator: "greaterThan", value: 48 }],
    actions: [
      { type: "sendNotification", target: "manager", value: "طلب معطّل" },
      { type: "updateField", target: "status", value: "escalated" },
    ],
    enabled: true,
    priority: 7,
  });

  // Auto-calculate totals on voucher
  engine.addRule({
    name: "حساب الإجمالي التلقائي",
    description: "يحسب الإجمالي والمصاريف والصافي تلقائياً",
    trigger: "onFieldChange",
    entity: "voucher",
    conditions: [{ field: "lines", operator: "isNotEmpty", value: null }],
    actions: [
      { type: "updateField", target: "total", value: "CALCULATED" },
      { type: "updateField", target: "tax", value: "CALCULATED" },
      { type: "updateField", target: "netAmount", value: "CALCULATED" },
    ],
    enabled: true,
    priority: 10,
  });
}

let engineInstance: WorkflowEngine | null = null;

export function getWorkflowEngine(): WorkflowEngine {
  if (!engineInstance) {
    engineInstance = new WorkflowEngine();
    createDefaultWorkflows(engineInstance);
  }
  return engineInstance;
}

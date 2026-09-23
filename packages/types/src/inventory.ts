import { z } from "zod";
import {
  UUIDSchema,
  ISODateStringSchema,
  CurrencyCodeSchema,
  TenantIdSchema,
  UserIdSchema,
  MoneySchema,
  AddressSchema,
  ContactInfoSchema,
  AuditFieldsSchema,
  EntityStatusSchema,
  PaginationInputSchema,
  PaginatedResponseSchema,
} from "./common";

export const UnitOfMeasureSchema = z.object({
  id: UUIDSchema,
  code: z.string().max(20),
  name: z.string().max(100),
  nameAr: z.string().max(100).optional(),
  baseUnit: z.boolean().default(false),
  conversionFactor: z.number().positive().default(1),
  precision: z.number().int().min(0).max(6).default(2),
});
export type UnitOfMeasure = z.infer<typeof UnitOfMeasureSchema>;

export const ProductCategorySchema = z
  .object({
    id: UUIDSchema,
    tenantId: TenantIdSchema,
    code: z.string().max(50),
    name: z.string().max(200),
    nameAr: z.string().max(200).optional(),
    parentId: UUIDSchema.optional(),
    description: z.string().optional(),
    status: EntityStatusSchema.default("active"),
  })
  .merge(AuditFieldsSchema);
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const ProductSchema = z
  .object({
    id: UUIDSchema,
    tenantId: TenantIdSchema,
    code: z.string().max(50),
    barcode: z.string().max(100).optional(),
    name: z.string().max(200),
    nameAr: z.string().max(200).optional(),
    description: z.string().optional(),
    categoryId: UUIDSchema.optional(),
    unitId: UUIDSchema,
    secondaryUnitId: UUIDSchema.optional(),
    secondaryUnitFactor: z.number().positive().default(1),
    type: z
      .enum(["product", "service", "combo", "raw_material", "asset"])
      .default("product"),
    trackInventory: z.boolean().default(true),
    trackExpiry: z.boolean().default(false),
    trackBatch: z.boolean().default(false),
    trackSerial: z.boolean().default(false),
    minStockLevel: z.number().nonnegative().default(0),
    maxStockLevel: z.number().nonnegative().optional(),
    reorderPoint: z.number().nonnegative().default(0),
    reorderQuantity: z.number().nonnegative().default(0),
    standardCost: MoneySchema.optional(),
    salePrice: MoneySchema.optional(),
    purchasePrice: MoneySchema.optional(),
    taxRate: z.number().min(0).max(100).default(15),
    weight: z.number().positive().optional(),
    dimensions: z
      .object({
        length: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
      })
      .optional(),
    status: EntityStatusSchema.default("active"),
    tags: z.array(z.string()).default([]),
    attributes: z.record(z.unknown()).default({}),
    metadata: z.record(z.unknown()).default({}),
  })
  .merge(AuditFieldsSchema);
export type Product = z.infer<typeof ProductSchema>;

export const ProductCreateSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  deletedAt: true,
  deletedBy: true,
});
export type ProductCreate = z.infer<typeof ProductCreateSchema>;

export const ProductUpdateSchema = ProductCreateSchema.partial();
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

export const WarehouseSchema = z
  .object({
    id: UUIDSchema,
    tenantId: TenantIdSchema,
    code: z.string().max(50),
    name: z.string().max(200),
    nameAr: z.string().max(200).optional(),
    address: AddressSchema.optional(),
    contact: ContactInfoSchema.optional(),
    managerId: UserIdSchema.optional(),
    isDefault: z.boolean().default(false),
    allowNegativeStock: z.boolean().default(false),
    status: EntityStatusSchema.default("active"),
  })
  .merge(AuditFieldsSchema);
export type Warehouse = z.infer<typeof WarehouseSchema>;

export const StockLevelSchema = z.object({
  id: UUIDSchema,
  tenantId: TenantIdSchema,
  productId: UUIDSchema,
  warehouseId: UUIDSchema,
  quantityOnHand: z.number().default(0),
  quantityReserved: z.number().default(0),
  quantityAvailable: z.number().default(0),
  quantityOnOrder: z.number().default(0),
  lastCountedAt: ISODateStringSchema.optional(),
  lastMovementAt: ISODateStringSchema.optional(),
  metadata: z.record(z.unknown()).default({}),
});
export type StockLevel = z.infer<typeof StockLevelSchema>;

export const StockMovementSchema = z
  .object({
    id: UUIDSchema,
    tenantId: TenantIdSchema,
    date: ISODateStringSchema,
    referenceType: z.enum([
      "purchase_receipt",
      "sales_issue",
      "transfer",
      "adjustment",
      "count",
      "production",
      "return",
    ]),
    referenceId: UUIDSchema,
    productId: UUIDSchema,
    warehouseId: UUIDSchema,
    toWarehouseId: UUIDSchema.optional(),
    batchId: UUIDSchema.optional(),
    serialNumber: z.string().max(100).optional(),
    quantity: z.number(),
    unitCost: MoneySchema.optional(),
    totalCost: MoneySchema.optional(),
    runningBalance: z.number(),
    notes: z.string().optional(),
    metadata: z.record(z.unknown()).default({}),
  })
  .merge(AuditFieldsSchema);
export type StockMovement = z.infer<typeof StockMovementSchema>;

export const BatchSchema = z
  .object({
    id: UUIDSchema,
    tenantId: TenantIdSchema,
    productId: UUIDSchema,
    batchNumber: z.string().max(100),
    manufactureDate: ISODateStringSchema.optional(),
    expiryDate: ISODateStringSchema.optional(),
    supplierId: UUIDSchema.optional(),
    quantityReceived: z.number().positive(),
    quantityRemaining: z.number().nonnegative(),
    unitCost: MoneySchema.optional(),
    status: z
      .enum(["active", "expired", "recalled", "consumed"])
      .default("active"),
    metadata: z.record(z.unknown()).default({}),
  })
  .merge(AuditFieldsSchema);
export type Batch = z.infer<typeof BatchSchema>;

export const SerialNumberSchema = z
  .object({
    id: UUIDSchema,
    tenantId: TenantIdSchema,
    productId: UUIDSchema,
    batchId: UUIDSchema.optional(),
    serialNumber: z.string().max(100),
    status: z
      .enum(["in_stock", "sold", "transferred", "returned", "damaged", "lost"])
      .default("in_stock"),
    warehouseId: UUIDSchema.optional(),
    customerId: UUIDSchema.optional(),
    saleDate: ISODateStringSchema.optional(),
    warrantyExpiry: ISODateStringSchema.optional(),
    metadata: z.record(z.unknown()).default({}),
  })
  .merge(AuditFieldsSchema);
export type SerialNumber = z.infer<typeof SerialNumberSchema>;

export const StockTransferSchema = z
  .object({
    id: UUIDSchema,
    tenantId: TenantIdSchema,
    number: z.string().max(50),
    date: ISODateStringSchema,
    fromWarehouseId: UUIDSchema,
    toWarehouseId: UUIDSchema,
    items: z
      .array(
        z.object({
          id: UUIDSchema,
          productId: UUIDSchema,
          batchId: UUIDSchema.optional(),
          serialNumbers: z.array(z.string()).optional(),
          quantity: z.number().positive(),
        })
      )
      .min(1),
    status: z
      .enum(["draft", "pending", "shipped", "received", "cancelled"])
      .default("draft"),
    shippedAt: ISODateStringSchema.optional(),
    receivedAt: ISODateStringSchema.optional(),
    notes: z.string().optional(),
    metadata: z.record(z.unknown()).default({}),
  })
  .merge(AuditFieldsSchema);
export type StockTransfer = z.infer<typeof StockTransferSchema>;

export const StockAdjustmentSchema = z
  .object({
    id: UUIDSchema,
    tenantId: TenantIdSchema,
    number: z.string().max(50),
    date: ISODateStringSchema,
    warehouseId: UUIDSchema,
    type: z.enum([
      "gain",
      "loss",
      "correction",
      "write_off",
      "damage",
      "theft",
    ]),
    items: z
      .array(
        z.object({
          id: UUIDSchema,
          productId: UUIDSchema,
          batchId: UUIDSchema.optional(),
          serialNumbers: z.array(z.string()).optional(),
          quantityBefore: z.number(),
          quantityAfter: z.number(),
          difference: z.number(),
          reason: z.string().max(500),
        })
      )
      .min(1),
    status: z
      .enum(["draft", "approved", "posted", "cancelled"])
      .default("draft"),
    approvedBy: UserIdSchema.optional(),
    approvedAt: ISODateStringSchema.optional(),
    notes: z.string().optional(),
    metadata: z.record(z.unknown()).default({}),
  })
  .merge(AuditFieldsSchema);
export type StockAdjustment = z.infer<typeof StockAdjustmentSchema>;

export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: UUIDSchema.optional(),
  type: z
    .enum(["product", "service", "combo", "raw_material", "asset"])
    .optional(),
  trackInventory: z.boolean().optional(),
  status: EntityStatusSchema.optional(),
  lowStock: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});
export type ProductFilter = z.infer<typeof ProductFilterSchema>;

export const StockLevelFilterSchema = z.object({
  productId: UUIDSchema.optional(),
  warehouseId: UUIDSchema.optional(),
  lowStock: z.boolean().optional(),
  outOfStock: z.boolean().optional(),
});
export type StockLevelFilter = z.infer<typeof StockLevelFilterSchema>;

export const PaginatedProductsSchema = PaginatedResponseSchema(ProductSchema);
export type PaginatedProducts = z.infer<typeof PaginatedProductsSchema>;

export const PaginatedWarehousesSchema =
  PaginatedResponseSchema(WarehouseSchema);
export type PaginatedWarehouses = z.infer<typeof PaginatedWarehousesSchema>;

export const PaginatedStockLevelsSchema =
  PaginatedResponseSchema(StockLevelSchema);
export type PaginatedStockLevels = z.infer<typeof PaginatedStockLevelsSchema>;

export const PaginatedStockMovementsSchema =
  PaginatedResponseSchema(StockMovementSchema);
export type PaginatedStockMovements = z.infer<
  typeof PaginatedStockMovementsSchema
>;

export const PaginatedBatchesSchema = PaginatedResponseSchema(BatchSchema);
export type PaginatedBatches = z.infer<typeof PaginatedBatchesSchema>;

export const PaginatedStockTransfersSchema =
  PaginatedResponseSchema(StockTransferSchema);
export type PaginatedStockTransfers = z.infer<
  typeof PaginatedStockTransfersSchema
>;

export const PaginatedStockAdjustmentsSchema = PaginatedResponseSchema(
  StockAdjustmentSchema
);
export type PaginatedStockAdjustments = z.infer<
  typeof PaginatedStockAdjustmentsSchema
>;

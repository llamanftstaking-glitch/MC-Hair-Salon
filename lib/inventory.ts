import "server-only";
import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { products as productsTable, inventoryTransactions as txTable } from "./schema";

export type ProductCategory = "color" | "treatment" | "styling" | "retail" | "supplies" | "tools" | "general";
export type TxType = "received" | "used" | "sold" | "adjustment" | "waste";

export interface Product {
  id: string; name: string; brand?: string;
  category: ProductCategory; sku?: string;
  costPrice: number; retailPrice?: number;
  unit: string; currentStock: number; minStock: number;
  vendor?: string; notes?: string; isActive: boolean;
  createdAt: string; updatedAt: string;
  serviceUsage: { service: string; qty: number }[];
}

export interface InventoryTransaction {
  id: string; productId: string; productName: string;
  type: TxType; quantity: number; date: string;
  staffName?: string; bookingId?: string;
  notes?: string; costAtTime?: number; createdAt: string;
}

function rowToProduct(r: typeof productsTable.$inferSelect): Product {
  return {
    id: r.id, name: r.name, brand: r.brand ?? undefined,
    category: (r.category as ProductCategory) ?? "general",
    sku: r.sku ?? undefined,
    costPrice: r.costPrice ?? 0, retailPrice: r.retailPrice ?? undefined,
    unit: r.unit ?? "each", currentStock: r.currentStock ?? 0,
    minStock: r.minStock ?? 1, vendor: r.vendor ?? undefined,
    notes: r.notes ?? undefined, isActive: r.isActive ?? true,
    createdAt: r.createdAt, updatedAt: r.updatedAt,
    serviceUsage: (r.serviceUsage as { service: string; qty: number }[]) ?? [],
  };
}

function rowToTx(r: typeof txTable.$inferSelect): InventoryTransaction {
  return {
    id: r.id, productId: r.productId, productName: r.productName,
    type: r.type as TxType, quantity: r.quantity, date: r.date,
    staffName: r.staffName ?? undefined, bookingId: r.bookingId ?? undefined,
    notes: r.notes ?? undefined, costAtTime: r.costAtTime ?? undefined,
    createdAt: r.createdAt,
  };
}

// ── Products ──────────────────────────────────────────────────────────────────
export async function getProducts(activeOnly = true): Promise<Product[]> {
  const rows = activeOnly
    ? await db.select().from(productsTable).where(eq(productsTable.isActive, true))
    : await db.select().from(productsTable);
  return rows.map(rowToProduct).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProductBySku(sku: string): Promise<Product | null> {
  const rows = await db.select().from(productsTable).where(eq(productsTable.sku, sku));
  return rows.length ? rowToProduct(rows[0]) : null;
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const now = new Date().toISOString();
  const p = { ...data, id: `prod-${Date.now()}`, createdAt: now, updatedAt: now };
  await db.insert(productsTable).values({
    id: p.id, name: p.name, brand: p.brand ?? null,
    category: p.category, sku: p.sku ?? null,
    costPrice: p.costPrice, retailPrice: p.retailPrice ?? null,
    unit: p.unit, currentStock: p.currentStock, minStock: p.minStock,
    vendor: p.vendor ?? null, notes: p.notes ?? null,
    isActive: p.isActive, createdAt: p.createdAt, updatedAt: p.updatedAt,
    serviceUsage: p.serviceUsage,
  });
  return p;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
  const set: Partial<typeof productsTable.$inferInsert> = { updatedAt: new Date().toISOString() };
  if (updates.name         !== undefined) set.name         = updates.name;
  if (updates.brand        !== undefined) set.brand        = updates.brand ?? null;
  if (updates.category     !== undefined) set.category     = updates.category;
  if (updates.sku          !== undefined) set.sku          = updates.sku ?? null;
  if (updates.costPrice    !== undefined) set.costPrice    = updates.costPrice;
  if (updates.retailPrice  !== undefined) set.retailPrice  = updates.retailPrice ?? null;
  if (updates.unit         !== undefined) set.unit         = updates.unit;
  if (updates.currentStock !== undefined) set.currentStock = updates.currentStock;
  if (updates.minStock     !== undefined) set.minStock     = updates.minStock;
  if (updates.vendor       !== undefined) set.vendor       = updates.vendor ?? null;
  if (updates.notes        !== undefined) set.notes        = updates.notes ?? null;
  if (updates.isActive     !== undefined) set.isActive     = updates.isActive;
  if (updates.serviceUsage !== undefined) set.serviceUsage = updates.serviceUsage;
  await db.update(productsTable).set(set).where(eq(productsTable.id, id));
  const rows = await db.select().from(productsTable).where(eq(productsTable.id, id));
  return rows.length ? rowToProduct(rows[0]) : null;
}

export async function adjustStock(productId: string, delta: number, type: TxType, opts: {
  staffName?: string; bookingId?: string; notes?: string;
} = {}): Promise<Product | null> {
  const rows = await db.select().from(productsTable).where(eq(productsTable.id, productId));
  if (!rows.length) return null;
  const current = rows[0].currentStock ?? 0;
  const newStock = Math.max(0, current + delta);
  const now = new Date().toISOString();
  const today = now.split("T")[0];
  await db.update(productsTable).set({ currentStock: newStock, updatedAt: now }).where(eq(productsTable.id, productId));
  await db.insert(txTable).values({
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
    productId, productName: rows[0].name,
    type, quantity: delta, date: today,
    staffName: opts.staffName ?? null, bookingId: opts.bookingId ?? null,
    notes: opts.notes ?? null, costAtTime: rows[0].costPrice ?? null,
    createdAt: now,
  });
  const updated = await db.select().from(productsTable).where(eq(productsTable.id, productId));
  return updated.length ? rowToProduct(updated[0]) : null;
}

// Deduct products linked to a confirmed service booking
export async function deductServiceInventory(service: string, bookingId: string): Promise<void> {
  const all = await getProducts();
  const linked = all.filter(p =>
    p.serviceUsage.some(u => service.toLowerCase().includes(u.service.toLowerCase()))
  );
  for (const p of linked) {
    const usage = p.serviceUsage.find(u => service.toLowerCase().includes(u.service.toLowerCase()));
    if (usage && usage.qty > 0) {
      await adjustStock(p.id, -usage.qty, "used", {
        bookingId, notes: `Auto-deducted for ${service}`,
      });
    }
  }
}

// ── Transactions ──────────────────────────────────────────────────────────────
export async function getTransactions(limit = 100): Promise<InventoryTransaction[]> {
  const rows = await db.select().from(txTable);
  return rows.map(rowToTx)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function getLowStockProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter(p => p.currentStock <= p.minStock);
}

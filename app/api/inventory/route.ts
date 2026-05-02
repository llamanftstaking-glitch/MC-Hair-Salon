import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getProducts, getProductBySku, createProduct, updateProduct,
  adjustStock, getLowStockProducts, getTransactions,
} from "@/lib/inventory";

export async function GET(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  const action = req.nextUrl.searchParams.get("action");
  if (action === "low_stock")   return NextResponse.json(await getLowStockProducts());
  if (action === "transactions") return NextResponse.json(await getTransactions(200));
  const sku = req.nextUrl.searchParams.get("sku");
  if (sku) {
    const p = await getProductBySku(sku);
    return p ? NextResponse.json(p) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(await getProducts(false));
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "adjust") {
      const { productId, delta, type, staffName, bookingId, notes } = body;
      const updated = await adjustStock(productId, delta, type, { staffName, bookingId, notes });
      return updated ? NextResponse.json(updated) : NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Create product
    const { action: _a, ...data } = body;
    const product = await createProduct({
      name: data.name, brand: data.brand, category: data.category ?? "general",
      sku: data.sku, costPrice: data.costPrice ?? 0, retailPrice: data.retailPrice,
      unit: data.unit ?? "each", currentStock: data.currentStock ?? 0,
      minStock: data.minStock ?? 1, vendor: data.vendor, notes: data.notes,
      isActive: true, serviceUsage: data.serviceUsage ?? [],
    });
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const updated = await updateProduct(id, updates);
    return updated ? NextResponse.json(updated) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id } = await req.json();
    await updateProduct(id, { isActive: false });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

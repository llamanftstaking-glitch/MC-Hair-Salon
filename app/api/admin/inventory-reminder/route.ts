import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export async function POST() {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const allProducts = await getProducts(true);
    const lowStock    = allProducts.filter(p => p.currentStock <= p.minStock);
    const outOfStock  = allProducts.filter(p => p.currentStock <= 0);

    // Try to send email via Resend if configured
    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const SALON_INBOX = process.env.SALON_INBOX_EMAIL || "hello@mchairsalon.com";
      const FROM        = process.env.RESEND_FROM_EMAIL || "MC Hair Salon <info@mchairsalon.com>";

      const rows = lowStock
        .map(p => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #222;">${p.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #222;color:${p.currentStock <= 0 ? "#ff4d4d" : "#ffaa00"}">
              ${p.currentStock} ${p.unit}${p.currentStock <= 0 ? " ⚠️ OUT OF STOCK" : ""}
            </td>
            <td style="padding:8px 12px;border-bottom:1px solid #222;color:#555">${p.minStock} ${p.unit}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #222;color:#555">${p.vendor ?? "—"}</td>
          </tr>
        `)
        .join("");

      await resend.emails.send({
        from:    FROM,
        to:      SALON_INBOX,
        subject: `📦 Monthly Inventory Reminder — ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:680px;margin:0 auto;background:#000;color:#f5f0e8;padding:32px;">
            <h1 style="font-family:Georgia,serif;color:#C9A84C;margin:0 0 8px;">Monthly Inventory Check</h1>
            <p style="color:#888;margin:0 0 24px;">
              ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} ·
              ${lowStock.length} item${lowStock.length !== 1 ? "s" : ""} need attention
            </p>
            ${lowStock.length === 0 ? `
              <p style="color:#55aa55;background:#0a1a0a;border:1px solid #1a4a1a;padding:16px;">
                ✓ All inventory levels are above minimum thresholds. No action required.
              </p>
            ` : `
              <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                <thead>
                  <tr style="background:#0f0f0f;">
                    <th style="text-align:left;padding:8px 12px;color:#C9A84C;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Product</th>
                    <th style="text-align:left;padding:8px 12px;color:#C9A84C;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Stock</th>
                    <th style="text-align:left;padding:8px 12px;color:#C9A84C;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Min</th>
                    <th style="text-align:left;padding:8px 12px;color:#C9A84C;font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Vendor</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
              <p style="color:#555;font-size:12px;">
                Log in to the admin panel → Operations → Inventory to reorder.
              </p>
            `}
          </div>
        `,
      });
      emailSent = true;
    }

    return NextResponse.json({
      success: true,
      emailSent,
      lowStockCount:   lowStock.length,
      outOfStockCount: outOfStock.length,
      items: lowStock.map(p => ({
        name:         p.name,
        currentStock: p.currentStock,
        minStock:     p.minStock,
        unit:         p.unit,
        vendor:       p.vendor,
      })),
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to generate reminder" },
      { status: 500 }
    );
  }
}

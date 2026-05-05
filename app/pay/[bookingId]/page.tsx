import { notFound } from "next/navigation";
import { getBookings } from "@/lib/bookings";
import PayClient from "./PayClient";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ bookingId: string }> }

export default async function PayPage({ params }: Props) {
  const { bookingId } = await params;
  const all = await getBookings();
  const booking = all.find(b => b.id === bookingId);

  if (!booking || booking.status !== "confirmed") notFound();
  if (!booking.servicePrice || booking.servicePrice <= 0) {
    return (
      <div className="min-h-screen bg-[var(--mc-bg)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-[#C9A84C] mb-2">MC Hair Salon & Spa</h1>
          <p className="text-[#888] mt-4">Online payment is not available for this booking.</p>
          <p className="text-[#555] text-sm mt-2">Please settle at the salon. <a href="tel:2129885252" className="text-[#C9A84C]">(212) 988-5252</a></p>
        </div>
      </div>
    );
  }

  return (
    <PayClient booking={{
      id:            booking.id,
      name:          booking.name,
      service:       booking.service,
      stylist:       booking.stylist,
      date:          booking.date,
      time:          booking.time,
      servicePrice:  booking.servicePrice,
      paymentStatus: (booking.paymentStatus ?? "unpaid") as "unpaid" | "paid",
      tipAmount:     booking.tipAmount,
    }} />
  );
}

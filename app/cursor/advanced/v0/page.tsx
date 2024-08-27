"use client";

import BookingCard from "@/app/components/booking-card";
import DatePicker from "@/app/components/date-picker";
import PropertyDetails from "@/app/components/property-details";
import SideHeader from "@/app/components/side-header";

export default function AdvancedPage() {
  return (
    <div className="flex min-h-screen">
      <SideHeader />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <DatePicker />
          <div className="grid gap-6 md:grid-cols-3">
            <PropertyDetails />
            <BookingCard />
          </div>
        </div>
      </main>
    </div>
  );
}

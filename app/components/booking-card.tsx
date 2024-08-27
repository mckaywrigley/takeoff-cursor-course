import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function BookingCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold">$250</span>
            <span className="text-muted-foreground"> / night</span>
          </div>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <span className="font-semibold">4.92</span>
            <span className="text-muted-foreground ml-1">(128)</span>
          </div>
        </div>
        <Button className="w-full mb-4">Check availability</Button>
        <p className="text-center text-sm text-muted-foreground">You won&apos;t be charged yet</p>
      </CardContent>
    </Card>
  );
}

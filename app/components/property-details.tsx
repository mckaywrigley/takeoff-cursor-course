import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bath, Bed, Medal, Star, Users } from "lucide-react";

export default function PropertyDetails() {
  return (
    <div className="md:col-span-2">
      <h1 className="text-3xl font-bold mb-2">Charming Cottage by the Lake</h1>
      <PropertyRating />
      <HostInfo />
      <PropertyAmenities />
      <p className="text-muted-foreground mb-6">Escape to this charming cottage nestled by the serene shores of Lake Tahoe. Perfect for a romantic getaway or a small family retreat, this cozy home offers stunning lake views and easy access to outdoor activities.</p>
    </div>
  );
}

function PropertyRating() {
  return (
    <div className="flex items-center space-x-1 mb-4">
      <Star className="w-5 h-5 text-yellow-400" />
      <span className="font-semibold">4.92</span>
      <span className="text-muted-foreground">(128 reviews)</span>
      <span className="mx-2">·</span>
      <Badge variant="outline">Superhost</Badge>
      <span className="mx-2">·</span>
      <span className="text-muted-foreground">Lake Tahoe, California</span>
    </div>
  );
}

function HostInfo() {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="Host"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Hosted by John Doe</h2>
              <p className="text-sm text-muted-foreground">Superhost · 5 years hosting</p>
            </div>
          </div>
          <Medal className="w-6 h-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyAmenities() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <AmenityItem
        icon={<Users className="w-5 h-5" />}
        text="4 guests"
      />
      <AmenityItem
        icon={<Bed className="w-5 h-5" />}
        text="2 bedrooms"
      />
      <AmenityItem
        icon={<Bath className="w-5 h-5" />}
        text="1 bathroom"
      />
    </div>
  );
}

function AmenityItem({ icon, text }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}

import Image from "next/image";

const listings = [
  { id: 1, image: "/listing1.jpg", title: "Cozy Cabin", price: 100, rating: 4.9 },
  { id: 2, image: "/listing2.jpg", title: "Beach House", price: 150, rating: 4.8 },
  { id: 3, image: "/listing3.jpg", title: "City Apartment", price: 80, rating: 4.7 },
  { id: 4, image: "/listing4.jpg", title: "Mountain Retreat", price: 120, rating: 4.9 }
];

export default function FeaturedListings() {
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Featured Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="rounded-lg overflow-hidden shadow-md"
          >
            <Image
              src={listing.image}
              alt={listing.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold">{listing.title}</h3>
              <p>${listing.price} / night</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{listing.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

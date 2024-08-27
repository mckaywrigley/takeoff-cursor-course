import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageCarousel({ images, currentImage, setCurrentImage }) {
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative mb-6">
      <div className="overflow-hidden rounded-lg aspect-video">
        <img
          src={images[currentImage]}
          alt={`Property image ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      <CarouselButton
        direction="left"
        onClick={prevImage}
      />
      <CarouselButton
        direction="right"
        onClick={nextImage}
      />
      <ImageIndicators
        images={images}
        currentImage={currentImage}
      />
    </div>
  );
}

function CarouselButton({ direction, onClick }) {
  const isLeft = direction === "left";
  return (
    <Button
      variant="outline"
      size="icon"
      className={`absolute ${isLeft ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white`}
      onClick={onClick}
    >
      {isLeft ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      <span className="sr-only">{isLeft ? "Previous" : "Next"} image</span>
    </Button>
  );
}

function ImageIndicators({ images, currentImage }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
      {images.map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
        />
      ))}
    </div>
  );
}

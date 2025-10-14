"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

interface HeroCarouselProps {
  images: Array<{
    id: string;
    caption?: string;
    alt?: string;
  }>;
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {images.map((img, i) => (
            <CarouselItem key={i} className="basis-full">
              <div className="flex flex-col gap-2">
                <div className="aspect-square rounded-full overflow-hidden border-4 border-[#FDF8F3] shadow-lg relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${img.id}`}
                    alt={img.alt || `Carousel image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                {img.caption && (
                  <p
                    className="text-center text-[#FDF8F3] text-sm italic"
                    style={{ fontFamily: "var(--font-architects-daughter)" }}
                  >
                    {img.caption}
                  </p>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

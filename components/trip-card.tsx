import { Heart } from "lucide-react";
import Image from "next/image";

interface TripCardProps {
  image?: string | null;
  title: string | undefined;
  dates: string;
  isFavorite: boolean;
}

export function TripCard({ image, title, dates, isFavorite }: TripCardProps) {
  return (
    <div className="cursor-pointer rounded-xl transition-transform ease-out hover:scale-[1.02]">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        {image ? (
          <Image
            src={image}
            alt={`Image of ${title}`}
            fill
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
            <p>
              <span className="text-lg grayscale">🏞</span> Image non disponible
            </p>
          </div>
        )}
      </div>
      <div className="py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {isFavorite && <Heart className="fill-rose-400 text-rose-400" />}
        </div>
        <p className="text-sm text-gray-500">{dates}</p>
      </div>
    </div>
  );
}

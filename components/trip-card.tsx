import Image from "next/image";
import { StaticImageData } from "next/image";

interface TripCardProps {
  image: StaticImageData;
  title: string;
  dates: string;
}

export function TripCard({ image, title, dates }: TripCardProps) {
  return (
    <div className="rounded-xl">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={`Image of ${title}`}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="py-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{dates}</p>
      </div>
    </div>
  );
}

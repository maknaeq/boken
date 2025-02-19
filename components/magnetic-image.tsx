"use client";

import { useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";

interface MagneticImageProps {
  src: StaticImageData;
  alt: string;
  title: string;
  description: string;
}

export default function MagneticImage({
  src,
  alt,
  title,
  description,
}: MagneticImageProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="flex h-80 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bo absolute bottom-5 left-5 z-50 text-background">
        <h3 className="text-xl">{title}</h3>
        <p className="text-sm font-extralight">{description}</p>
      </div>
      <div className="absolute bottom-0 z-30 my-auto h-2/3 w-full rounded-xl bg-gradient-to-t from-gray-900/80 to-gray-50/0" />
      <Image
        src={src}
        alt={alt}
        width={500}
        height={320}
        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${isHovered ? 1.13 : 1.2})`,
        }}
      />
    </div>
  );
}

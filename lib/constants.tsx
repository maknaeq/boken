import { Binoculars, Caravan, Image, Laptop, Sparkles } from "lucide-react";
import { NavItemType } from "@/lib/type";
import { TripCategory } from "@/lib/type";
import { JSX } from "react";

export const navitems: NavItemType[] = [
  {
    name: "Voyages",
    href: "/dashboard/trips",
    icon: <Binoculars />,
  },
  {
    name: "Photos",
    href: "/dashboard/photos",
    icon: <Image />,
  },
];

export const TRIP_CATEGORIES: Record<TripCategory, JSX.Element> = {
  Backpacking: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      color={"#000000"}
      fill={"none"}
    >
      <path
        d="M19 14H20.2389C21.3498 14 22.1831 15.0805 21.9652 16.2386L21.7003 17.6466C21.4429 19.015 20.3127 20 19 20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 14H3.76113C2.65015 14 1.81691 15.0805 2.03479 16.2386L2.29967 17.6466C2.55711 19.015 3.68731 20 5 20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M18.2696 10.5L18.7911 15.1967C19.071 18.379 19.211 19.9701 18.2696 20.985C17.3283 22 15.7125 22 12.481 22H11.519C8.2875 22 6.67174 22 5.73038 20.985C4.78901 19.9701 4.92899 18.379 5.20893 15.1967L5.73038 10.4999"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5.2617 8.86971C5.01152 7.45403 4.88643 6.74619 5.13559 6.20431C5.30195 5.84248 5.57803 5.53512 5.9291 5.32087C6.45489 5 7.21577 5 8.73753 5H15.2625C16.7842 5 17.5451 5 18.0709 5.32087C18.422 5.53512 18.698 5.84248 18.8644 6.20431C19.1136 6.74619 18.9885 7.45403 18.7383 8.86971L18.6872 9.15901C18.5902 9.70796 18.5417 9.98243 18.446 10.2349C18.2806 10.671 18.0104 11.0651 17.6565 11.3863C17.4517 11.5722 17.2062 11.7266 16.7153 12.0353C16.2537 12.3255 16.0229 12.4706 15.779 12.5845C15.3579 12.7812 14.905 12.9105 14.439 12.9672C14.169 13 13.8916 13 13.3369 13H10.6631C10.1084 13 9.831 13 9.56102 12.9672C9.09497 12.9105 8.64214 12.7812 8.22104 12.5845C7.9771 12.4706 7.74632 12.3255 7.28474 12.0353C6.79376 11.7266 6.54827 11.5722 6.34346 11.3863C5.98959 11.0651 5.7194 10.671 5.55404 10.2349C5.45833 9.98243 5.40983 9.70796 5.31282 9.15901L5.2617 8.86971Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 10.0024L12.0087 10.0001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Luxe: <Sparkles size={18} />,
  Roadtrip: <Caravan size={18} />,
  "Digital Nomad": <Laptop size={18} />,
  Normal: <></>,
};

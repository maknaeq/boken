import { Binoculars, Image } from "lucide-react";
import { NavItemType } from "@/lib/type";

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

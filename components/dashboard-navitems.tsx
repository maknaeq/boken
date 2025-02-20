"use client";

import { navitems } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

function DashboardNavItems() {
  const pathname = usePathname();

  if (pathname === "/dashboard/trips/create") return null;

  return (
    <ul className="flex items-center justify-center gap-2">
      {navitems.map((item) => (
        <li key={item.href}>
          <Link href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "hover:bg-yellow-300/40",
                pathname === item.href && "bg-yellow-300/50",
              )}
            >
              {item.icon && item.icon}
              {item.name}
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default DashboardNavItems;

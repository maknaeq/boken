"use client";

import { navitems } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

function DashboardNavItems() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center justify-center gap-2">
      {navitems.map((item) => (
        <li key={item.href}>
          <Link href={item.href}>
            <Button
              variant="ghost"
              className={cn(pathname === item.href && "bg-accent")}
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

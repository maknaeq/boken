"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RedirectButtonType } from "@/lib/type";
import { usePathname } from "next/navigation";
import { privateRoutes } from "@/routes";

function RedirectButton({
  className,
  variant,
  children,
  href,
}: RedirectButtonType) {
  const pathname = usePathname();
  if (privateRoutes.some((path) => pathname.includes(path))) {
    return null;
  }
  return (
    <Link href={href} className="group w-fit">
      <Button
        className={cn(
          "transition-all ease-out group-hover:scale-95",
          className,
        )}
        variant={variant}
      >
        {children}
      </Button>
    </Link>
  );
}

export default RedirectButton;

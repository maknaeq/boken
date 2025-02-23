"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

function BackButton() {
  const router = useRouter();
  return (
    <Button variant="link" onClick={() => router.back()} className="px-0">
      <ChevronLeft />
      Retour
    </Button>
  );
}

export default BackButton;

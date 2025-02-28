"use client";
import { toast } from "@/hooks/use-toast";
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

type ShareButtonProps = {
  currentTrip: {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    price: number | null;
    category: "Backpacking" | "Luxe" | "Roadtrip" | "Digital Nomad" | "Normal";
    imageCover: string | null;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
  }[];
  shareUrl: string;
};

function ShareButton({ currentTrip, shareUrl }: ShareButtonProps) {
  return (
    <Button
      variant="outline"
      className="flex-1"
      onClick={async () => {
        await navigator.share({
          title: currentTrip?.[0].title,
          text: `Découvre mon voyage: ${currentTrip?.[0].title}`,
          url: shareUrl,
        });
        toast({
          title: "Lien copié",
          description: "Le lien de partage a été copié dans le presse-papier",
        });
      }}
    >
      <Share2 />
      Partager
    </Button>
  );
}

export default ShareButton;

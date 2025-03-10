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
};

export default function ShareButton({ currentTrip }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: currentTrip?.[0].title,
          text: `Découvre mon voyage: ${currentTrip?.[0].title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl.toString());
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papier",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          variant: "destructive",
          title: "Erreur de partage",
          description: "Impossible de partager le lien",
        });
      }
    }
  };

  return (
    <Button variant="outline" className="flex-1" onClick={handleShare}>
      <Share2 className="mr-2 h-4 w-4" />
      Partager
    </Button>
  );
}

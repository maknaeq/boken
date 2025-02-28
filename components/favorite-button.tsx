"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/app/actions/favoriteActions";
import { toast } from "@/hooks/use-toast";

function FavoriteButton({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  const [favorites, setFavorites] = useState<
    Array<{ userId: string; tripId: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isFavorite = favorites.some((fav) => fav.tripId === tripId);

  async function handleFavorite() {
    setIsLoading(true);
    try {
      if (isFavorite) {
        const res = await removeFavorite(userId, tripId);
        if (res.success) {
          setFavorites(favorites.filter((fav) => fav.tripId !== tripId));
          toast({
            title: "Retiré des favoris",
            description: "Le voyage a été retiré de vos favoris",
          });
        }
      } else {
        const res = await addFavorite(userId, tripId);
        if (res.success) {
          setFavorites([...favorites, { userId, tripId }]);
          toast({
            title: "Ajouté aux favoris",
            description: "Le voyage a été ajouté à vos favoris",
          });
        }
      }
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getFavorites(userId).then((res) => {
      setFavorites(res);
    });
  }, [userId]);

  return (
    <Button
      variant="outline"
      className="flex-1"
      onClick={handleFavorite}
      disabled={isLoading}
    >
      <Heart
        className={`mr-2 h-4 w-4 ${
          isFavorite ? "fill-rose-400 text-rose-400" : ""
        }`}
      />
      {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    </Button>
  );
}

export default FavoriteButton;

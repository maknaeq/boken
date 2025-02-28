"use client";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function FiltersSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showFavorites = searchParams.get("favorites") === "true";

  const toggleFavorites = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (showFavorites) {
      newParams.delete("favorites");
    } else {
      newParams.set("favorites", "true");
    }
    router.push(`/dashboard/trips?${newParams.toString()}`);
  };

  return (
    <div className="space-y-2 pb-8 pt-5">
      <h2 className="text-lg font-bold">Filtres</h2>
      <div className="flex w-full justify-center gap-2 md:justify-start">
        <Button
          variant={"outline"}
          onClick={toggleFavorites}
          className="flex items-center gap-2"
        >
          <Heart
            className={showFavorites ? "fill-rose-400 text-rose-400" : ""}
            size={16}
          />
          Favoris
        </Button>
      </div>
      {showFavorites && (
        <Button
          variant="link"
          className="flex items-center p-0 text-blue-500"
          onClick={() => router.push("/dashboard/trips")}
        >
          <X size={16} />
          Favoris uniquement
        </Button>
      )}
    </div>
  );
}

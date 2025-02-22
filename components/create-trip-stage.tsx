"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/lib/type";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateTripStageForm from "@/components/create-trip-stage-form";

interface CreateTripStageProps {
  user: User | undefined;
  tripId: string;
}

export function CreateTripStage({ user, tripId }: CreateTripStageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsOpen(true);
      //Clean the search params
      router.replace("/dashboard/trips");
    }
  }, [searchParams, router]);

  if (!user) return null;

  return (
    <div className="rounded-xl">
      <Dialog open={isOpen}>
        <Button onClick={() => setIsOpen(true)}>
          <Plus />
          Ajouter une étape
        </Button>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Créer un voyage</DialogTitle>
          <CreateTripStageForm
            user={user}
            setIsOpen={setIsOpen}
            tripId={tripId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

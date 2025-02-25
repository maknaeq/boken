"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/lib/type";
import { useState } from "react";
import CreateTripStageForm from "@/components/create-trip-stage-form";

interface CreateTripStageProps {
  user: User | undefined;
  tripId: string;
}

export function CreateTripStage({ user, tripId }: CreateTripStageProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="rounded-xl">
      <Dialog open={isOpen}>
        <Button onClick={() => setIsOpen(true)}>
          <Plus />
          Ajouter une étape
        </Button>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Ajouter une étape</DialogTitle>
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

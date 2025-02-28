"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import CreateTripPlaceForm from "@/components/create-trip-place-form";
import { User } from "@/lib/type";

interface CreateTripStageProps {
  user: User;
  stageId: string;
}

export default function CreatePlace({ user, stageId }: CreateTripStageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl">
      <Dialog open={isOpen}>
        <Button onClick={() => setIsOpen(true)} size={"sm"}>
          <Plus />
          Ajouter une/des activité(s)
        </Button>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Ajouter une/des activité(s)</DialogTitle>
          <CreateTripPlaceForm
            stageId={stageId}
            user={user}
            setIsOpen={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

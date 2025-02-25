"use client";
import React, { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadFile from "./upload-file";

interface AddingImageButtonProps {
  userId: string;
  tripId: string;
  stageId: string;
  placeId: string;
}

function AddingImageButton({
  userId,
  tripId,
  stageId,
  placeId,
}: AddingImageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)}>
          <ImagePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une/des image(s)</DialogTitle>
          <DialogDescription>
            Ajoutez des images pour illustrer votre étape
          </DialogDescription>
        </DialogHeader>
        <UploadFile
          userId={userId}
          tripId={tripId}
          stageId={stageId}
          placeId={placeId}
          setIsOpen={setIsOpen}
        />
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            size="sm"
            className="w-full"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddingImageButton;

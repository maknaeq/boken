"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import CreateTripForm from "./create-trip-form";
import { User } from "@/lib/type";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function CreateTripCard({ user }: { user: User }) {
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

  return (
    <div className="rounded-xl">
      <Dialog open={isOpen}>
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-dashed">
          <div className="flex items-center">
            <Button variant={"bento"} onClick={() => setIsOpen(true)}>
              <Plus />
              Créer un voyage
            </Button>
          </div>
        </div>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Créer un voyage</DialogTitle>
          <CreateTripForm user={user} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

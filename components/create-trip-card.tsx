import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function CreateTripCard() {
  return (
    <div className="rounded-xl">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-dashed">
        <div className="flex items-center">
          <Link href="/dashboard/trips/create">
            <Button variant={"bento"}>
              <Plus />
              Créer un voyage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

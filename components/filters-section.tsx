import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";

export function FiltersSection() {
  return (
    <div className="space-y-2 pb-8 pt-5">
      <div className="flex w-full justify-center gap-2 md:justify-start">
        <Button variant={"outline"}>
          Pays <ChevronDown />
        </Button>
        <Button variant={"outline"}>
          Prix <ChevronDown />
        </Button>
        <Button variant={"outline"}>
          Date <ChevronDown />
        </Button>
      </div>
      <Button variant="link" className="flex items-center p-0 text-blue-500">
        <X />
        Asie
      </Button>
    </div>
  );
}

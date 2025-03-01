"use client";

import { useToast } from "@/hooks/use-toast"; // Notez le changement d'import
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ToastContainer() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const router = useRouter();
  const { toast } = useToast(); // Utilisez le hook useToast

  useEffect(() => {
    if (status === "deleted") {
      toast({
        title: "Voyage supprimé",
        description: "Le voyage a bien été supprimé.",
        variant: "destructive",
      });

      const timeout = setTimeout(() => {
        router.replace("/dashboard/trips");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [status, router, toast]);

  return null;
}

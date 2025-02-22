"use client";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTripStageFormSchema, User } from "@/lib/type";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createTripStage } from "@/app/actions/tripActions";

// Types améliorés pour l'API OpenCage
interface OpenCageResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    country?: string;
    city?: string;
    state?: string;
  };
}

interface OpenCageResponse {
  results: OpenCageResult[];
  status: {
    code: number;
    message: string;
  };
  rate: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

interface LocationSuggestion {
  location: string;
  latitude: string;
  longitude: string;
}

// Validation du schéma améliorée
const extendedTripStageSchema = createTripStageFormSchema.extend({
  latitude: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    },
    { message: "Latitude invalide (doit être entre -90 et 90)" },
  ),
  longitude: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    },
    { message: "Longitude invalide (doit être entre -180 et 180)" },
  ),
});

function CreateTripStageForm({
  user,
  tripId,
  setIsOpen,
}: {
  user: User;
  tripId: string;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof extendedTripStageSchema>>({
    resolver: zodResolver(extendedTripStageSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      latitude: "",
      longitude: "",
    },
  });

  const fetchLocations = async (searchText: string) => {
    if (!searchText || searchText.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const now = Date.now();
    if (now - lastSearchTime < 1500) {
      return;
    }
    setLastSearchTime(now);

    setIsSearching(true);
    const apiKey = "439643db78944902816df543440897bf";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      searchText,
    )}&key=${apiKey}&limit=5&no_annotations=1&language=fr`;

    try {
      const { data } = await axios.get<OpenCageResponse>(url);

      if (data.rate.remaining < 20) {
        toast({
          title: "Avertissement",
          description:
            "Le nombre de recherches disponibles est limité. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return;
      }

      const newSuggestions = data.results.map(
        (result): LocationSuggestion => ({
          location: result.formatted,
          latitude: result.geometry.lat.toString(),
          longitude: result.geometry.lng.toString(),
        }),
      );

      setSuggestions(newSuggestions);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.status === 402
            ? "Limite de requêtes atteinte. Veuillez réessayer plus tard."
            : "Erreur lors de la recherche du lieu. Veuillez réessayer.";

        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((value: string) => fetchLocations(value), 500),
    [],
  );

  async function onSubmit(values: z.infer<typeof extendedTripStageSchema>) {
    try {
      // Validation supplémentaire des coordonnées
      const lat = parseFloat(values.latitude);
      const lng = parseFloat(values.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Coordonnées géographiques invalides");
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error("Coordonnées géographiques hors limites");
      }

      const result = await createTripStage(
        values,
        tripId,
        user?.[0].id as string,
      );

      if (!result.success) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "L'étape a été créée avec succès",
      });

      // Fermer le modal/form si nécessaire
      if (setIsOpen) {
        setIsOpen(false);
      }

      // Reset du formulaire
      form.reset();

      // Rafraîchir la page ou la liste des étapes
      router.refresh();
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez cette étape de voyage..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Lieu</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Rechercher une ville/pays/lieu…"
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedFetch(e.target.value);
                    }}
                  />
                  {isSearching && (
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-pulse text-muted-foreground" />
                  )}
                </div>
              </FormControl>
              {suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-white shadow-md">
                  {suggestions.map((place, index) => (
                    <li
                      key={index}
                      className={cn(
                        "cursor-pointer p-2 hover:bg-gray-100",
                        index !== suggestions.length - 1 && "border-b",
                      )}
                      onClick={() => {
                        form.setValue("location", place.location, {
                          shouldValidate: true,
                        });
                        form.setValue("latitude", place.latitude, {
                          shouldValidate: true,
                        });
                        form.setValue("longitude", place.longitude, {
                          shouldValidate: true,
                        });
                        setSuggestions([]);
                      }}
                    >
                      {place.location}
                    </li>
                  ))}
                </ul>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("latitude")} />
        <input type="hidden" {...form.register("longitude")} />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (setIsOpen) setIsOpen(false);
              form.reset();
            }}
            disabled={form.formState.isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Ajouter
          </Button>
        </div>
      </form>
    </Form>
  );
}

function debounce<T extends (...args: string[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default CreateTripStageForm;

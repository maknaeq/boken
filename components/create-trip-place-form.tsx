// components/forms/create-place-form.tsx
"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createPlaceFormSchema, User } from "@/lib/type";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createPlace } from "@/app/actions/placeActions";

interface LocationSuggestion {
  location: string;
  latitude: string;
  longitude: string;
}
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

interface CreatePlaceFormProps {
  user: User;
  stageId: string;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function CreatePlaceForm({
  user,
  stageId,
  setIsOpen,
}: CreatePlaceFormProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof createPlaceFormSchema>>({
    resolver: zodResolver(createPlaceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Autre",
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

  const debouncedFetch = React.useCallback(
    debounce((value: string) => fetchLocations(value), 500),
    [],
  );

  async function onSubmit(values: z.infer<typeof createPlaceFormSchema>) {
    try {
      const result = await createPlace(values, stageId, user?.[0].id);

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
        description: "Le lieu a été créé avec succès",
      });

      if (setIsOpen) {
        setIsOpen(false);
      }

      form.reset();
      router.refresh();
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création du lieu" +
          JSON.stringify(error),
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du lieu</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Tour Eiffel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Musée">Musée</SelectItem>
                  <SelectItem value="Parc">Parc</SelectItem>
                  <SelectItem value="Monument">Monument</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
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
                  placeholder="Décrivez ce lieu..."
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
              <FormLabel>Localisation</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Rechercher un lieu..."
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
                        form.setValue("latitude", place.latitude);
                        form.setValue("longitude", place.longitude);
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

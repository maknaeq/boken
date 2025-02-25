"use client";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTripFormSchema, TripCategory, User } from "@/lib/type";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, LoaderCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { createTrip } from "@/app/actions/tripActions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TRIP_CATEGORIES } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogClose } from "@/components/ui/dialog";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!;

function CreateTripForm({
  user,
  setIsOpen,
}: {
  user: User;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [unsplashImages, setUnsplashImages] = useState<
    Array<{
      id: string;
      urls: { regular: string; thumb: string };
      alt_description: string;
    }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const form = useForm<z.infer<typeof createTripFormSchema>>({
    resolver: zodResolver(createTripFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      price: "",
      category: "Normal",
      image: "",
    },
  });

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      form.setValue("image", "pending-upload");
    }
  };

  const searchUnsplashImages = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=20`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        },
      );
      const data = await response.json();
      setUnsplashImages(data.results);
    } catch (error) {
      console.error("Erreur lors de la recherche d'images:", error);
    }
    setIsLoading(false);
  };

  async function onSubmit(values: z.infer<typeof createTripFormSchema>) {
    try {
      toast({
        title: "Création du voyage",
        description:
          "Veuillez patienter pendant la création de votre voyage...",
        duration: 10000,
      });

      let imageUrl = values.image;

      // Si c'est un fichier local à uploader
      if (selectedFile && values.image === "pending-upload") {
        const fileName = `trips/cover-${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("boken_medias")
          .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("boken_medias")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const tripData = {
        ...values,
        image: imageUrl, // Utilisez l'URL de l'image uploadée ou l'URL Unsplash
        startDate: values.dateRange.from,
        endDate: values.dateRange.to,
      };

      const result = await createTrip(tripData, user?.[0].id as string);

      if (result?.success && result?.tripId) {
        toast({
          title: "Voyage créé !",
          description: "Redirection vers votre nouveau voyage...",
          duration: 3000,
        });

        form.reset();
        setSelectedFile(null);
        setPreviewUrl("");
        if (setIsOpen) setIsOpen(false);
        router.push(`/dashboard/trips/${result.tripId}`);
      } else {
        // En cas d'erreur, si un fichier a été uploadé, on peut le supprimer
        if (imageUrl && imageUrl !== values.image) {
          const fileName = imageUrl.split("/").pop();
          await supabase.storage
            .from("boken_medias")
            .remove([`trips/${fileName}`]);
        }

        toast({
          title: "Erreur",
          description: result?.error || "Une erreur est survenue",
          variant: "destructive",
        });

        form.setError("root", {
          type: "server",
          message: result?.error || "Une erreur est survenue",
        });
      }
    } catch (error: unknown) {
      // Afficher le toast d'erreur
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du voyage",
        variant: "destructive",
      });

      console.error("Erreur lors de la création du voyage", error);
      form.setError("root", {
        type: "server",
        message: "Une erreur est survenue lors de la création du voyage",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Titre</FormLabel>
              <FormControl>
                <Input {...field} id="title" />
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
              <FormLabel htmlFor="category">Style de voyage</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionnez une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(TRIP_CATEGORIES) as TripCategory[]).map(
                      (category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
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
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Racontez ce que vous allez faire pendant ce voyage"
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
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Dates du voyage</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, "dd/MM/yyyy", {
                            locale: fr,
                          })}{" "}
                          -{" "}
                          {format(field.value.to, "dd/MM/yyyy", { locale: fr })}
                        </>
                      ) : (
                        format(field.value.from, "dd/MM/yyyy", { locale: fr })
                      )
                    ) : (
                      <span>Sélectionnez les dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date("1900-01-01")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="price">Prix</FormLabel>
              <FormControl>
                <Input {...field} id="price" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image de couverture</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                      >
                        {field.value
                          ? "Changer l'image"
                          : "Sélectionner une image"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Image de couverture</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="upload" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="upload">Upload</TabsTrigger>
                          <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload" className="space-y-4">
                          <div className="flex flex-col gap-4">
                            <input
                              type="file"
                              accept="image/*"
                              id="image-upload"
                              hidden
                              onChange={handleFileSelect}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full border-dashed"
                              onClick={() =>
                                document.getElementById("image-upload")?.click()
                              }
                            >
                              Choisir un fichier
                            </Button>
                            {previewUrl && (
                              <div className="relative aspect-video">
                                <Image
                                  src={previewUrl}
                                  alt="Preview"
                                  className="rounded-lg object-cover"
                                  fill
                                  sizes="100vw"
                                />
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="unsplash" className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Rechercher des images..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  searchUnsplashImages(searchQuery);
                                }
                              }}
                            />
                            <Button
                              type="button"
                              onClick={() => searchUnsplashImages(searchQuery)}
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>

                          {isLoading ? (
                            <div className="flex justify-center">
                              <LoaderCircle className="h-8 w-8 animate-spin" />
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                              {unsplashImages.map((image) => (
                                <div
                                  key={image.id}
                                  className={cn(
                                    "relative aspect-video cursor-pointer overflow-hidden rounded-lg",
                                    field.value === image.urls.regular &&
                                      "ring-2 ring-primary",
                                  )}
                                  onClick={() => {
                                    field.onChange(image.urls.regular);
                                  }}
                                >
                                  <Image
                                    src={image.urls.thumb}
                                    alt={image.alt_description}
                                    className="object-cover transition-opacity hover:opacity-75"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                      <DialogClose asChild>
                        <div className="flex gap-2">
                          <Button className="w-full" variant="outline">
                            Fermer
                          </Button>
                          <Button className="w-full">Valider</Button>
                        </div>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>

                  {(field.value || previewUrl) && (
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      {previewUrl && field.value && (
                        <Image
                          src={previewUrl || field.value}
                          alt="Image sélectionnée"
                          className="object-cover"
                          fill
                          sizes="100vw"
                        />
                      )}

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2 z-10"
                        onClick={() => {
                          field.onChange("");
                          setSelectedFile(null);
                          setPreviewUrl("");
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <Button
            className="flex-1"
            type="button"
            variant="outline"
            onClick={() => {
              if (setIsOpen) setIsOpen(false);
              form.reset();
            }}
            disabled={form.formState.isSubmitting}
          >
            Annuler
          </Button>
          <Button
            className="flex-1"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <LoaderCircle className="animate-spin" />
            )}
            Créer
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateTripForm;

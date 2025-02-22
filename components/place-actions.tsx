"use client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EllipsisVertical, Loader2, Pencil, Trash2 } from "lucide-react";
import { deletePlaceById, updatePlaceById } from "@/app/actions/placeActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface PlaceFormData {
  name: string;
  description: string;
  category: string;
}

interface PlaceActionsProps {
  place: {
    id: string;
    stageId: string | null;
    name: string;
    description: string | null;
    category: string | null;
    latitude: string | null;
    longitude: string | null;
    createdAt: Date;
  };
}

const CATEGORIES = [
  { value: "Restaurant", label: "Restaurant" },
  { value: "Musée", label: "Musée" },
  { value: "Parc", label: "Parc" },
  { value: "Monument", label: "Monument" },
  { value: "Shopping", label: "Shopping" },
  { value: "Autre", label: "Autre" },
] as const;

export default function PlaceActions({ place }: PlaceActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const form = useForm<PlaceFormData>({
    defaultValues: {
      name: place.name,
      description: place.description || "",
      category: place.category,
    },
  });

  // Vérifie si le formulaire a été modifié
  const isDirty = form.formState.isDirty;

  async function handleDelete(placeId: string) {
    setIsLoading(true);
    try {
      const result = await deletePlaceById(placeId);
      if (!result.success) {
        throw new Error(result.error);
      }
      toast({
        title: "Lieu supprimé",
        description: "Le lieu a été supprimé avec succès",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le lieu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: PlaceFormData) {
    // Si aucune modification n'a été faite, on ferme simplement le dialog
    if (!isDirty) {
      setIsDialogOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await updatePlaceById(place.id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      toast({
        title: "Lieu mis à jour",
        description: "Les modifications ont été enregistrées",
      });
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le lieu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Reset le formulaire quand le dialog se ferme
  React.useEffect(() => {
    if (!isDialogOpen) {
      form.reset({
        name: place.name,
        description: place.description || "",
        category: place.category,
      });
    }
  }, [isDialogOpen, form, place]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le lieu</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
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

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsDialogOpen(false);
                      }}
                      disabled={isLoading}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading || !isDirty}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le lieu ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Le lieu sera définitivement
                  supprimé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(place.id)}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

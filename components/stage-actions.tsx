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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { deleteStageById, updateStageById } from "@/app/actions/tripActions";

interface StageFormData {
  title: string;
  description: string;
  location: string;
}

interface StageActionsProps {
  stage: {
    id: string;
    tripId: string | null;
    title: string;
    description: string | null;
    location: string;
    latitude: string | null;
    longitude: string | null;
    createdAt: Date;
    photos: {
      id: string;
      userId: string;
      tripId: string;
      stageId: string;
      placeId: string;
      url: string;
      description: string | null;
      createdAt: Date;
    }[];
  };
}

export default function StageActions({ stage }: StageActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const form = useForm<StageFormData>({
    defaultValues: {
      title: stage.title,
      description: stage.description || "",
      location: stage.location,
    },
  });

  const isDirty = form.formState.isDirty;

  async function handleDelete(stageId: string) {
    setIsLoading(true);
    try {
      const result = await deleteStageById(stageId);
      if (!result.success) {
        throw new Error(result.error);
      }
      toast({
        title: "Étape supprimée",
        description: "L'étape a été supprimée avec succès",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'étape",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: StageFormData) {
    if (!isDirty) {
      setIsDialogOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateStageById(stage.id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      toast({
        title: "Étape mise à jour",
        description: "Les modifications ont été enregistrées",
      });
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'étape",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (!isDialogOpen) {
      form.reset({
        title: stage.title,
        description: stage.description || "",
        location: stage.location,
      });
    }
  }, [isDialogOpen, form, stage]);

  return (
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
              <DialogTitle>Modifier l&apos;étape</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localisation</FormLabel>
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
                          placeholder="Décrivez cette étape..."
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
                    onClick={() => setIsDialogOpen(false)}
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
              <AlertDialogTitle>Supprimer l&apos;étape ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L&apos;étape et tous ses lieux
                seront définitivement supprimés.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(stage.id)}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

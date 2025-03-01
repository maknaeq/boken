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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  EllipsisVertical,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { deleteTrip, updateTrip } from "@/app/actions/tripActions";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { User } from "@/lib/type";
import { toast } from "@/hooks/use-toast";

interface TripData {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  price: number | null;
  category: "Backpacking" | "Luxe" | "Roadtrip" | "Digital Nomad" | "Normal";
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

interface TripActionsProps {
  trip: TripData;
  user: User;
}

interface TripFormData {
  title: string;
  description: string;
  category: "Backpacking" | "Luxe" | "Roadtrip" | "Digital Nomad" | "Normal";
  price: number;
  dateRange: DateRange;
}

export default function TripActions({ trip, user }: TripActionsProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const router = useRouter();

  const form = useForm<TripFormData>({
    defaultValues: {
      title: trip.title,
      description: trip.description || "",
      category: trip.category,
      price: trip.price || 0,
      dateRange: {
        from: trip.startDate ? new Date(trip.startDate) : undefined,
        to: trip.endDate ? new Date(trip.endDate) : undefined,
      },
    },
  });

  const isDirty = form.formState.isDirty;

  async function handleDelete() {
    setIsLoading(true);
    try {
      const result = await deleteTrip(trip.id, user?.[0].id as string);
      if (result?.success) {
        router.push("/dashboard/trips?status=deleted");
      }
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression du voyage", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
    setIsDialogOpen(false);
  }

  async function onSubmit(data: TripFormData) {
    setIsLoading(true);
    if (!isDirty) {
      setIsDialogOpen(false);
      return;
    }
    try {
      const result = await updateTrip(trip.id, {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        startDate: data.dateRange.from || new Date(),
        endDate: data.dateRange.to || new Date(),
      });

      if (result?.success) {
        form.reset();
        router.refresh();
        setIsDialogOpen(false);
      } else {
        console.error("Erreur lors de la mise à jour:", result?.error);
      }
    } catch (error: unknown) {
      console.error("Erreur lors de la mise à jour du voyage", error);
    }

    setIsLoading(false);
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le voyage</DialogTitle>
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent defaultValue={field.value}>
                          <SelectItem value="Backpacking">
                            Backpacking
                          </SelectItem>
                          <SelectItem value="Luxe">Luxe</SelectItem>
                          <SelectItem value="Roadtrip">Roadtrip</SelectItem>
                          <SelectItem value="Digital Nomad">
                            Digital Nomad
                          </SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
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
                          placeholder="Description du voyage..."
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                      <FormLabel>Dates</FormLabel>
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
                                  {format(field.value.from, "dd/MM/yyyy")} -{" "}
                                  {format(field.value.to, "dd/MM/yyyy")}
                                </>
                              ) : (
                                format(field.value.from, "dd/MM/yyyy")
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
                          />
                        </PopoverContent>
                      </Popover>
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
              <AlertDialogTitle>Supprimer le voyage ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le voyage sera définitivement
                supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
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

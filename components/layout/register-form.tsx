"use client";

import { useState } from "react";
import { Darumadrop_One } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { ArrowLeft, Eye, EyeOff, Loader2Icon } from "lucide-react";
import GoogleSVG from "@/public/images/google.svg";

import { formSchema } from "@/lib/type";
import { Separator } from "@/components/ui/separator";
import Splash1 from "@/public/images/register-splash_1.jpg";
import Splash2 from "@/public/images/register-splash_2.jpg";
import Splash3 from "@/public/images/register-splash_3.jpg";

const darumadropOne = Darumadrop_One({
  weight: "400",
  subsets: ["latin"],
});

function RegisterForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(values);
        console.log(values);
        form.reset();
      }, 2000);
    });
  }

  return (
    <main className="h-screen max-h-screen min-h-screen p-4">
      <div className="rounded-[calc(16px+0.75rem)]p-4 h-full md:flex">
        <div className="relative hidden h-full w-1/2 rounded-xl sm:overflow-hidden md:block">
          <Link href="/">
            <Button
              variant={"outline"}
              className="absolute left-4 top-4 z-50 border-0"
            >
              <ArrowLeft />
              Retour à l&apos;accueil
            </Button>
          </Link>
          <Image src={Splash1} alt="" fill className="object-cover" />
        </div>
        <Link
          href="/"
          className="mb-5 flex gap-2 text-sm underline underline-offset-2 md:hidden"
        >
          <ArrowLeft />
          Retour à l&apos;accueil
        </Link>
        <div className="md:w-1/2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 sm:px-24 md:space-y-10 md:px-10 xl:px-32"
              autoComplete="off"
            >
              {/* <div className="relative mx-auto w-full text-start">
                <h1 className="text-7xl font-semibold">Bōken</h1>
                <span
                  className={`${darumadropOne.className} absolute top-[60px] text-xl`}
                >
                  ぼうけん
                </span>
              </div> */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="mb-5 mt-3">
                    <h2 className="text-xl font-semibold md:text-3xl">
                      Créer un compte
                    </h2>
                    <p className="text-sm text-gray-500">
                      Entrer vos informations personnelles pour accéder à nos
                      services.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={() => {
                      alert("Connexion avec Google");
                    }}
                  >
                    <Image
                      src={GoogleSVG}
                      alt="Google"
                      width={18}
                      height={18}
                    />
                    Connexion avec Google
                  </Button>

                  <div className="flex items-center gap-4 py-3">
                    <Separator className="flex-1" />
                    <span className="text-sm text-muted-foreground">ou</span>
                    <Separator className="flex-1" />
                  </div>

                  <div className="flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez votre prénom"
                              {...field}
                              autoComplete="off"
                              className="placeholder:text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez votre nom"
                              className="placeholder:text-sm"
                              {...field}
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="exemple@mail.com"
                            className="placeholder:text-sm"
                            {...field}
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Choisissez un mot de passe"
                              className="placeholder:text-sm"
                              type={isPasswordVisible ? "text" : "password"}
                              autoComplete="new-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() =>
                                setIsPasswordVisible((prev) => !prev)
                              }
                              className="absolute right-0 top-0 hover:bg-transparent"
                            >
                              {isPasswordVisible ? <Eye /> : <EyeOff />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Confirmez votre mot de passe"
                              className="placeholder:text-sm"
                              type={
                                isConfirmPasswordVisible ? "text" : "password"
                              }
                              autoComplete="confirm-new-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() =>
                                setIsConfirmPasswordVisible((prev) => !prev)
                              }
                              className="absolute right-0 top-0 hover:bg-transparent"
                            >
                              {isConfirmPasswordVisible ? <Eye /> : <EyeOff />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                  <p className="text-center text-sm">
                    Vous avez déjà un compte ?{" "}
                    <Link
                      href="/login"
                      className="text-blue-500 hover:underline"
                    >
                      Connectez-vous
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default RegisterForm;

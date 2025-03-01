import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Darumadrop_One } from "next/font/google";
import "@/app/globals.css";
import UserLoginCard from "@/components/user-login-card";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { Footer } from "@/components/footer";
import { NetworkStatus } from "@/components/network-status";

const brocolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
});

const darumadropOne = Darumadrop_One({
  weight: "400",
  subsets: ["latin"],
});

const APP_NAME = "Boken";
const APP_DEFAULT_TITLE = "Boken";
const APP_TITLE_TEMPLATE = "%s - Boken";
const APP_DESCRIPTION = "Souvenir et planification de voyage";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr">
      <meta name="apple-mobile-web-app-title" content="Boken" />
      <body
        className={`${brocolageGrotesque.className} flex min-h-screen flex-col`}
      >
        <NetworkStatus />
        <div className="px-4 pb-5 pt-8">
          {/* <div className="absolute z-50 h-52 w-full max-w-[cacl(100vw-30px)] bg-gradient-to-b from-gray-900 to-gray-50/0 px-3 py-5 text-background"> */}
          <div className="mx-auto flex w-full max-w-[1280px] items-start justify-between">
            <Link href={"/"} className="relative">
              <h1 className="text-xl font-semibold">Bōken</h1>
              <span
                className={`${darumadropOne.className} absolute top-5 text-xs`}
              >
                ぼうけん
              </span>
            </Link>
            <div className="space-x-2">
              <UserLoginCard />
            </div>
          </div>
        </div>
        <main className="flex-1 px-4">{children}</main>
        <Footer />
        <Toaster />
        <Sonner position="top-center" />
      </body>
    </html>
  );
}

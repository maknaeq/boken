import Link from "next/link";
import { Darumadrop_One } from "next/font/google";

const darumadropOne = Darumadrop_One({
  weight: "400",
  subsets: ["latin"],
});

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto max-w-[1280px] px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo et Description */}
          <div className="space-y-3">
            <div className="relative">
              <h2 className="text-xl font-semibold">Bōken</h2>
              <span
                className={`${darumadropOne.className} absolute top-5 text-xs`}
              >
                ぼうけん
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Planifiez et partagez vos aventures de voyage.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/trips"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Mes Voyages
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/photos"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Mes Photos
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="mb-3 font-semibold">Informations Légales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Politique des cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/mentions"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:contact@boken.fr"
                  className="text-muted-foreground hover:text-foreground"
                >
                  contact@boken.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright et Crédits */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Bōken. Tous droits réservés.</p>
          <p className="mt-2">
            Certaines images utilisées sur ce site peuvent être soumises à des
            droits d&apos;auteur. Les images de voyage sont la propriété de
            leurs auteurs respectifs.
          </p>
        </div>
      </div>
    </footer>
  );
}

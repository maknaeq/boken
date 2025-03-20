# Bōken - Votre Planificateur de Voyages Solo

Bōken (ぼうけん) est une application Next.js conçue pour aider les voyageurs solitaires à planifier, organiser et documenter leurs aventures sans stress.

## ✨ Fonctionnalités

- **Planification de Voyages Personnalisés** : Créez des itinéraires de voyage personnalisés selon vos préférences, budget et durée
- **Accès Hors Ligne** : Accédez à vos itinéraires et cartes même sans connexion internet
- **Optimisation du Budget** : Obtenez des suggestions adaptées à votre budget et optimisez vos trajets
- **Journal de Voyage Personnel** : Documentez vos aventures en ajoutant des lieux, des notes et des photos

## 🚀 Démo Live

Visitez l'application en ligne : [boken-omega.vercel.app](https://boken-omega.vercel.app)

## 💻 Stack Technique

- [Next.js](https://nextjs.org/) - Framework React pour la production
- [TypeScript](https://www.typescriptlang.org/) - Vérification de type statique
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitaire
- [shadcn/ui](https://ui.shadcn.com/) - Bibliothèque de composants UI
- [Drizzle ORM](https://orm.drizzle.team/) - ORM TypeScript
- [Supabase](https://supabase.com/) - Backend as a Service
- [NextAuth.js](https://next-auth.js.org/) - Authentification pour Next.js
- [Lucide icons](https://lucide.dev/) - Icônes cohérentes et élégantes

## 🛠️ Premiers Pas

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/maknaeq/boken.git
   or
    git clone git@github.com:maknaeq/boken.git

   cd boken
   ```

2. Assurez-vous que `pnpm` est installé sur votre machine. Si ce n'est pas le cas, installez-le avec :

   ```bash
   npm install -g pnpm
   ```

   Si vous ne souhaitez pas utiliser `pnpm`, vous pouvez aussi installer les dépendances avec `npm` ou `yarn` :

   ```bash
   npm install   # ou yarn install
   ```

3. Installez les dépendances :

   ```bash
   pnpm install
   ```

4. Configurez les variables d'environnement : Créez un fichier `.env` basé sur le modèle `.env.example`

5. Lancez le serveur de développement :

   ```bash
   pnpm dev
   ```

6. Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir le résultat.

## 📂 Structure du Projet

📁 **app/** - Fichiers et routes Next.js App Router  
 ├── 📂 **public/** - Pages publiques  
 ├── 📂 **private/** - Pages pour utilisateurs authentifiés  
 ├── 📂 **auth/** - Pages liées à l'authentification

📁 **components/** - Composants UI réutilisables

📁 **db/** - Schéma de base de données et requêtes

📁 **lib/** - Fonctions utilitaires et code partagé

📁 **public/** - Ressources statiques

## 📱 Application Web Progressive

Bōken est configurée comme une **Application Web Progressive (PWA)**, permettant aux utilisateurs de l'installer sur leurs appareils et d'accéder à leurs informations de voyage hors ligne.

## ⚖️ Licence

Tous droits réservés. Ce projet est un logiciel propriétaire.

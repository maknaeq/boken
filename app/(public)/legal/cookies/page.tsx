export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-[1280px] py-8">
      <h1 className="mb-6 text-3xl font-bold">Politique des Cookies</h1>
      <div className="prose prose-sm max-w-none">
        <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
        <h2>1. Utilisation des cookies</h2>
        <p>Nous utilisons des cookies pour améliorer votre expérience.</p>
      </div>
    </div>
  );
}

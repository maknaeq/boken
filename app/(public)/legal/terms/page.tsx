export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[1280px] py-8">
      <h1 className="mb-6 text-3xl font-bold">Conditions d&apos;Utilisation</h1>
      <div className="prose prose-sm max-w-none">
        <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
        <h2>1. Acceptation des conditions</h2>
        <p>
          En utilisant Bōken, vous acceptez ces conditions d&apos;utilisation.
        </p>
      </div>
    </div>
  );
}

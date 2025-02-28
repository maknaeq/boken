export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[1280px] py-8">
      <h1 className="mb-6 text-3xl font-bold">Politique de Confidentialité</h1>
      <div className="prose prose-sm max-w-none">
        <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
        <h2>1. Collecte des données</h2>
        <p>Nous collectons les informations suivantes :</p>
        <ul>
          <li>Informations de compte (email, nom)</li>
          <li>Données de voyage</li>
          <li>Photos uploadées</li>
        </ul>
      </div>
    </div>
  );
}

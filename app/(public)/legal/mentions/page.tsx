export default function MentionsPage() {
  return (
    <div className="mx-auto max-w-[1280px] py-8">
      <h1 className="mb-6 text-3xl font-bold">Mentions Légales</h1>
      <div className="prose prose-sm max-w-none">
        <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
        <h2>1. Éditeur</h2>
        <p>Bōken</p>
        <p>Email : contact@boken.fr</p>
      </div>
    </div>
  );
}

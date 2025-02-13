import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="space-y-4">
      <Button variant="default" className="block">
        Default
      </Button>
      <Button variant="destructive" className="block">
        Destructive
      </Button>
      <Button variant="secondary" className="block">
        Secondary
      </Button>
      <Button variant="ghost" className="block">
        Ghost
      </Button>
      <Button variant="link" className="block">
        Link
      </Button>
      <Button variant="outline" className="block">
        Outline
      </Button>
    </div>
  );
}

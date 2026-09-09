import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="flex flex-col items-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-autism-blue/10">
            <FileQuestion className="h-8 w-8 text-autism-blue" />
          </div>
          <h2 className="mb-2 text-xl font-bold">Página não encontrada</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            A página que você procura não existe ou foi movida.
          </p>
          <Link href="/">
            <Button className="puzzle-gradient font-semibold">
              Voltar ao início
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

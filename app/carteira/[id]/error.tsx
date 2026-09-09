"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CarteiraError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="flex flex-col items-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-autism-red/10">
            <AlertTriangle className="h-8 w-8 text-autism-red" />
          </div>
          <h2 className="mb-2 text-xl font-bold">Erro ao carregar carteira</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Não foi possível carregar os dados da carteira.
          </p>
          <div className="flex gap-3">
            <Button onClick={reset} variant="outline">
              Tentar novamente
            </Button>
            <Link href="/">
              <Button className="puzzle-gradient font-semibold">
                Voltar ao início
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

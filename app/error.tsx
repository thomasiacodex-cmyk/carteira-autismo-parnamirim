"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
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
          <h2 className="mb-2 text-xl font-bold">Algo deu errado</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Ocorreu um erro inesperado. Tente novamente.
          </p>
          <Button onClick={reset} className="puzzle-gradient font-semibold">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

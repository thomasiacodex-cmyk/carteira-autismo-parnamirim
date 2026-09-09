import { Suspense } from "react";
import { RedefinirSenhaContent } from "./client";

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[75vh] items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      }
    >
      <RedefinirSenhaContent />
    </Suspense>
  );
}

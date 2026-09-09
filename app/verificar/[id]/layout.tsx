import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificar Autenticidade da CIPTEA",
  description:
    "Verifique a autenticidade de uma Carteira de Identificação da Pessoa com Transtorno do Espectro Autista (CIPTEA) emitida em Parnamirim/RN.",
};

export default function VerificarLayout({ children }: { children: React.ReactNode }) {
  return children;
}

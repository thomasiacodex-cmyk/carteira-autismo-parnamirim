import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Faça login para acessar sua CIPTEA — Carteira de Identificação da Pessoa com Transtorno do Espectro Autista. Parnamirim/RN.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

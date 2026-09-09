import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta",
  description:
    "Crie sua conta para solicitar a CIPTEA — Carteira de Identificação da Pessoa com Transtorno do Espectro Autista. Gratuito para moradores de Parnamirim/RN.",
};

export default function CadastroLayout({ children }: { children: React.ReactNode }) {
  return children;
}

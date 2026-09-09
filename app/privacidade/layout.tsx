import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — LGPD",
  description:
    "Política de privacidade e proteção de dados pessoais (LGPD) do sistema CIPTEA Digital de Parnamirim/RN.",
};

export default function PrivacidadeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

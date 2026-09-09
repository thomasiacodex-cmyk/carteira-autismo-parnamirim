import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Senha",
  description:
    "Recupere sua senha de acesso ao sistema CIPTEA Digital de Parnamirim/RN.",
  robots: { index: false, follow: false },
};

export default function EsqueciSenhaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

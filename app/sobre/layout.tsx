import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre a CIPTEA — Direitos e Legislação",
  description:
    "Saiba tudo sobre a CIPTEA, a Lei Romeo Mion, direitos da pessoa com TEA e o Transtorno do Espectro Autista. Informação oficial de Parnamirim/RN.",
};

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return children;
}

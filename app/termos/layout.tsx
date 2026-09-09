import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos e condições de uso do sistema CIPTEA Digital de Parnamirim/RN.",
};

export default function TermosLayout({ children }: { children: React.ReactNode }) {
  return children;
}

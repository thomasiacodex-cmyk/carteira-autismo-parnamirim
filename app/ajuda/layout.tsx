import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Central de Ajuda — FAQ",
  description:
    "Perguntas frequentes sobre a CIPTEA: documentos necessários, processo de solicitação, validade, renovação e contato. Parnamirim/RN.",
};

export default function AjudaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

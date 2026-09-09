import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUsuarioLogado } from "@/lib/auth";
import { PerfilClient } from "./client";

export const metadata: Metadata = {
  title: "Editar Perfil",
  robots: { index: false, follow: false },
};

export default async function PerfilPage() {
  const usuario = await getUsuarioLogado();

  if (!usuario) {
    redirect("/login");
  }

  return <PerfilClient usuario={usuario} />;
}

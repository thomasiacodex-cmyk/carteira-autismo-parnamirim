import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUsuarioLogado } from "@/lib/auth";
import { listarCarteirasDoUsuario } from "@/lib/actions";
import { MinhaContaClient } from "./client";

export const metadata: Metadata = {
  title: "Minha Conta",
  robots: { index: false, follow: false },
};

export default async function MinhaContaPage() {
  const usuario = await getUsuarioLogado();

  if (!usuario) {
    redirect("/login");
  }

  const carteiras = await listarCarteirasDoUsuario(usuario.id);

  return <MinhaContaClient usuario={usuario} carteiras={carteiras} />;
}

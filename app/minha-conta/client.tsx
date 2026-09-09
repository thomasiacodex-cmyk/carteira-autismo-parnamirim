"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  User,
  CreditCard,
  Plus,
  Eye,
  LogOut,
  Mail,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle,
  MailCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/lib/auth";
import { renovarCarteira } from "@/lib/actions";
import type { Usuario, Carteira } from "@/lib/schema";

interface Props {
  usuario: Usuario;
  carteiras: Carteira[];
}

const statusConfig = {
  emitida: {
    label: "Emitida",
    icon: CheckCircle2,
    color: "text-autism-green",
    bg: "bg-autism-green/10",
    badge: "success" as const,
  },
  em_analise: {
    label: "Em Análise",
    icon: Clock,
    color: "text-autism-yellow",
    bg: "bg-autism-yellow/10",
    badge: "secondary" as const,
  },
  negada: {
    label: "Negada",
    icon: XCircle,
    color: "text-autism-red",
    bg: "bg-autism-red/10",
    badge: "destructive" as const,
  },
};

export function MinhaContaClient({ usuario, carteiras }: Props) {
  const router = useRouter();
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Você saiu da sua conta");
    router.push("/login");
  };

  const handleRenewal = async (carteiraId: string) => {
    setRenewingId(carteiraId);
    try {
      const result = await renovarCarteira(carteiraId);
      if (result.success) {
        toast.success("Renovação solicitada com sucesso!");
        router.push(`/carteira/${result.id}?new=true`);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Erro ao renovar carteira");
    } finally {
      setRenewingId(null);
    }
  };

  const handleExportData = () => {
    window.open("/api/lgpd/exportar", "_blank");
    toast.success("Download dos seus dados iniciado");
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/lgpd/excluir", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Conta excluída permanentemente");
        router.push("/");
      } else {
        toast.error(data.error || "Erro ao excluir conta");
      }
    } catch {
      toast.error("Erro ao excluir conta");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Email verification notice */}
        {!usuario.emailVerificado && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950"
          >
            <MailCheck className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                E-mail não verificado
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Verifique seu e-mail ({usuario.email}) clicando no link que enviamos. Verifique também a caixa de spam.
              </p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-autism-blue/10">
              <User className="h-7 w-7 text-autism-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Olá, {usuario.nome.split(" ")[0]}!</h1>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {usuario.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-autism-blue/10">
                <CreditCard className="h-6 w-6 text-autism-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold">{carteiras.length}</p>
                <p className="text-xs text-muted-foreground">
                  Carteira(s) Emitida(s)
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-autism-green/10">
                <CheckCircle2 className="h-6 w-6 text-autism-green" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {carteiras.filter((c) => c.status === "emitida").length}
                </p>
                <p className="text-xs text-muted-foreground">Ativa(s)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-autism-yellow/10">
                <FileText className="h-6 w-6 text-autism-yellow" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuario.cpf}</p>
                <p className="text-xs text-muted-foreground">Seu CPF</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-8" />

        {/* Carteiras */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Minhas Carteiras</h2>
          <Link href="/solicitar">
            <Button className="gap-2 puzzle-gradient font-semibold">
              <Plus className="h-4 w-4" />
              Solicitar Nova
            </Button>
          </Link>
        </div>

        {carteiras.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center py-16">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-autism-blue/10">
                  <CreditCard className="h-10 w-10 text-autism-blue" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Nenhuma carteira ainda
                </h3>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                  Você ainda não solicitou sua CIPTEA.
                  <br />
                  Clique abaixo para solicitar sua primeira carteira.
                </p>
                <Link href="/solicitar">
                  <Button className="gap-2 puzzle-gradient font-semibold" size="lg">
                    <Plus className="h-5 w-5" />
                    Solicitar Carteira CIPTEA
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {carteiras.map((carteira, i) => {
              const status = statusConfig[carteira.status];
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={carteira.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-0 shadow-md transition-all hover:shadow-lg">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${status.bg}`}
                          >
                            <StatusIcon className={`h-6 w-6 ${status.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">
                                {carteira.nomeCompleto}
                              </h3>
                              <Badge variant={status.badge}>
                                {status.label}
                              </Badge>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span>CID: {carteira.cid}</span>
                              <span>•</span>
                              <span>
                                Emissão:{" "}
                                {(() => {
                                  try {
                                    return format(
                                      parseISO(carteira.dataEmissao),
                                      "dd/MM/yyyy",
                                      { locale: ptBR },
                                    );
                                  } catch {
                                    return carteira.dataEmissao;
                                  }
                                })()}
                              </span>
                              <span>•</span>
                              <span>
                                Validade:{" "}
                                {(() => {
                                  try {
                                    return format(
                                      parseISO(carteira.dataValidade),
                                      "dd/MM/yyyy",
                                      { locale: ptBR },
                                    );
                                  } catch {
                                    return carteira.dataValidade;
                                  }
                                })()}
                              </span>
                            </div>
                            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                              ID: {carteira.id}
                            </p>
                            {carteira.status === "negada" && carteira.motivoRejeicao && (
                              <div className="mt-2 rounded-md border border-autism-red/20 bg-autism-red/5 px-3 py-2">
                                <p className="text-xs font-semibold text-autism-red">Motivo da rejeição:</p>
                                <p className="text-xs text-autism-red/80">{carteira.motivoRejeicao}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {carteira.status === "emitida" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              disabled={renewingId === carteira.id}
                              onClick={() => handleRenewal(carteira.id)}
                            >
                              <RefreshCw className={`h-3 w-3 ${renewingId === carteira.id ? "animate-spin" : ""}`} />
                              Renovar
                            </Button>
                          )}
                          <Link href={`/carteira/${carteira.id}`}>
                            <Button
                              variant="outline"
                              className="gap-2 border-autism-blue text-autism-blue hover:bg-autism-blue/5"
                            >
                              <Eye className="h-4 w-4" />
                              Ver Carteira
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* LGPD Section */}
        <Separator className="my-8" />
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-muted-foreground">Seus Dados (LGPD)</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              Exportar Meus Dados
            </Button>
            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-autism-red text-autism-red hover:bg-autism-red/5"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir Minha Conta
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-autism-red/30 bg-autism-red/5 px-4 py-2">
                <AlertTriangle className="h-4 w-4 text-autism-red" />
                <span className="text-sm text-autism-red">Tem certeza? Esta ação é irreversível.</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                >
                  Sim, Excluir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a exportar ou excluir seus dados pessoais a qualquer momento.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

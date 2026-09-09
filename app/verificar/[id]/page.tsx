"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format, parseISO, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Calendar,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VerifyData {
  id: string;
  nomeCompleto: string;
  cpf: string;
  status: string;
  dataEmissao: string;
  dataValidade: string;
  fotoUrl: string | null;
  verificado: boolean;
}

export default function VerificarPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<VerifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/verify/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-autism-blue" />
          <p className="text-sm text-muted-foreground">Verificando carteira...</p>
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="w-full max-w-md border-0 shadow-2xl">
            <CardContent className="flex flex-col items-center py-12">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-autism-red/10">
                <XCircle className="h-10 w-10 text-autism-red" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">Carteira Não Encontrada</h1>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                O código informado não corresponde a nenhuma CIPTEA registrada no sistema.
              </p>
              <Link href="/">
                <Button className="puzzle-gradient font-semibold">
                  Ir para o Início
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const isExpired = isPast(parseISO(data.dataValidade));
  const isValid = data.status === "emitida" && !isExpired;

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden border-0 shadow-2xl">
          {/* Status banner */}
          <div
            className={`px-6 py-5 text-center text-white ${
              isValid ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"
            }`}
          >
            <div className="mb-2 flex justify-center">
              {isValid ? (
                <CheckCircle2 className="h-12 w-12" />
              ) : isExpired ? (
                <AlertTriangle className="h-12 w-12" />
              ) : (
                <XCircle className="h-12 w-12" />
              )}
            </div>
            <h1 className="text-xl font-bold">
              {isValid
                ? "Carteira Válida"
                : isExpired
                  ? "Carteira Expirada"
                  : "Carteira Inválida"}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              Verificação CIPTEA — Parnamirim/RN
            </p>
          </div>

          <CardContent className="p-6">
            {/* Photo + name */}
            <div className="mb-5 flex items-center gap-4">
              {data.fotoUrl ? (
                <img
                  src={data.fotoUrl}
                  alt="Foto"
                  className="h-16 w-14 rounded-lg border-2 border-autism-blue/20 object-cover"
                />
              ) : (
                <div className="flex h-16 w-14 items-center justify-center rounded-lg bg-autism-blue/10">
                  <User className="h-7 w-7 text-autism-blue" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold">{data.nomeCompleto}</h2>
                <p className="text-sm text-muted-foreground">CPF: {data.cpf}</p>
              </div>
            </div>

            <Separator className="mb-5" />

            {/* Details grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Status
                </span>
                <Badge variant={isValid ? "success" : "destructive"}>
                  {isValid ? "Válida" : isExpired ? "Expirada" : data.status === "negada" ? "Negada" : "Em Análise"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Emissão
                </span>
                <span className="text-sm font-medium">{formatDate(data.dataEmissao)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Validade
                </span>
                <span className={`text-sm font-medium ${isExpired ? "text-autism-red" : ""}`}>
                  {formatDate(data.dataValidade)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  ID da Carteira
                </span>
                <span className="font-mono text-xs text-muted-foreground">{data.id}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
              <p className="text-[11px] text-muted-foreground">
                Verificação oficial — Lei nº 13.977/2020 (Lei Romeo Mion)
              </p>
              <p className="text-[10px] text-muted-foreground">
                Prefeitura de Parnamirim/RN • Secretaria SEMIDH
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

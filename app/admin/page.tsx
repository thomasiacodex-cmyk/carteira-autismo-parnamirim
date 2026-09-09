"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Lock,
  Eye,
  Search,
  LogOut,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { listarCarteiras, atualizarStatusCarteira } from "@/lib/actions";
import { verificarSenhaAdmin } from "@/lib/auth";
import type { Carteira } from "@/lib/schema";
import { toast } from "sonner";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(true); // senha do admin desativada
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [carteiras, setCarteiras] = useState<Carteira[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCarteira, setSelectedCarteira] = useState<Carteira | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const valid = await verificarSenhaAdmin(password);
      if (valid) {
        setAuthenticated(true);
      } else {
        setError("Senha incorreta");
      }
    } catch {
      setError("Erro ao verificar senha");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      setLoading(true);
      listarCarteiras().then((data) => {
        setCarteiras(data);
        setLoading(false);
      });
    }
  }, [authenticated]);

  const filteredCarteiras = carteiras.filter(
    (c) =>
      c.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
      c.cpf.includes(search) ||
      c.id.includes(search),
  );

  const stats = {
    total: carteiras.length,
    emitidas: carteiras.filter((c) => c.status === "emitida").length,
    analise: carteiras.filter((c) => c.status === "em_analise").length,
    negadas: carteiras.filter((c) => c.status === "negada").length,
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "emitida" | "em_analise" | "negada",
    motivo?: string,
  ) => {
    const result = await atualizarStatusCarteira(id, newStatus, motivo);
    if (result.success) {
      setCarteiras((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, status: newStatus, motivoRejeicao: newStatus === "negada" ? (motivo || null) : null }
            : c,
        ),
      );
      toast.success("Status atualizado com sucesso");
    } else {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) {
      toast.error("Informe o motivo da rejeição");
      return;
    }
    await handleStatusChange(rejectId, "negada", rejectReason.trim());
    setRejectId(null);
    setRejectReason("");
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          <Card className="w-full max-w-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-autism-blue/10">
                <Lock className="h-7 w-7 text-autism-blue" />
              </div>
              <CardTitle>Área Administrativa</CardTitle>
              <p className="text-sm text-muted-foreground">Insira a senha para acessar</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                {error && <p className="text-xs text-autism-red">{error}</p>}
              </div>
              <Button onClick={handleLogin} className="w-full puzzle-gradient font-semibold" disabled={loading}>
                {loading ? "Verificando..." : "Entrar"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">{carteiras.length} carteira(s) registrada(s)</p>
          </div>
          <Button variant="outline" onClick={() => setAuthenticated(false)} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome, CPF ou ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Total", value: stats.total, icon: Users, bg: "bg-autism-blue/10", color: "text-autism-blue" },
            { label: "Emitidas", value: stats.emitidas, icon: CheckCircle2, bg: "bg-emerald-100", color: "text-emerald-600" },
            { label: "Em Análise", value: stats.analise, icon: CreditCard, bg: "bg-amber-100", color: "text-amber-600" },
            { label: "Negadas", value: stats.negadas, icon: AlertTriangle, bg: "bg-red-100", color: "text-red-600" },
          ].map((s) => (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted/20" />
            ))}
          </div>
        ) : filteredCarteiras.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12">
              <p className="text-lg font-medium text-muted-foreground">
                {search ? "Nenhuma carteira encontrada" : "Nenhuma carteira emitida ainda"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-900">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">CPF</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">CID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Emissão</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCarteiras.map((c) => (
                    <tr key={c.id} className="transition hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{c.nomeCompleto}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{c.id.slice(0, 8)}...</p>
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{c.cpf}</td>
                      <td className="hidden px-4 py-3 text-sm font-semibold text-autism-blue md:table-cell">{c.cid}</td>
                      <td className="px-4 py-3">
                        <select
                          value={c.status}
                          onChange={(e) => {
                            const val = e.target.value as "emitida" | "em_analise" | "negada";
                            if (val === "negada") {
                              setRejectId(c.id);
                            } else {
                              handleStatusChange(c.id, val);
                            }
                          }}
                          className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold outline-none ${
                            c.status === "emitida"
                              ? "bg-emerald-500 text-white"
                              : c.status === "negada"
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <option value="emitida">Emitida</option>
                          <option value="em_analise">Em Análise</option>
                          <option value="negada">Negada</option>
                        </select>
                        {c.status === "negada" && c.motivoRejeicao && (
                          <p className="mt-1 max-w-[180px] truncate text-[10px] text-autism-red">{c.motivoRejeicao}</p>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                        {(() => {
                          try {
                            return format(parseISO(c.dataEmissao), "dd/MM/yyyy", { locale: ptBR });
                          } catch {
                            return c.dataEmissao;
                          }
                        })()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" className="gap-1" onClick={() => setSelectedCarteira(c)}>
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Detalhes</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Rejection reason modal */}
      <AnimatePresence>
        {rejectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => { setRejectId(null); setRejectReason(""); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base text-autism-red">
                      <AlertTriangle className="h-5 w-5" />
                      Rejeitar Carteira
                    </CardTitle>
                    <Button size="icon" variant="ghost" onClick={() => { setRejectId(null); setRejectReason(""); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="motivo">Motivo da Rejeição *</Label>
                    <textarea
                      id="motivo"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Ex: Laudo médico ilegível, CID não corresponde ao diagnóstico..."
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setRejectId(null); setRejectReason(""); }}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
                      Confirmar Rejeição
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail/Document viewer modal */}
      <AnimatePresence>
        {selectedCarteira && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
            onClick={() => setSelectedCarteira(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="my-8 w-full max-w-2xl"
            >
              <Card className="max-h-[85vh] overflow-y-auto border-0 shadow-2xl">
                <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedCarteira.nomeCompleto}</CardTitle>
                    <Button size="icon" variant="ghost" onClick={() => setSelectedCarteira(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">ID: {selectedCarteira.id}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal data */}
                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Dados Pessoais</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground">CPF</span>
                        <p className="font-medium">{selectedCarteira.cpf}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Nascimento</span>
                        <p className="font-medium">{selectedCarteira.dataNascimento}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">CID</span>
                        <p className="font-semibold text-autism-blue">{selectedCarteira.cid}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">CRM Médico</span>
                        <p className="font-medium">{selectedCarteira.crmMedico}</p>
                      </div>
                      {selectedCarteira.nomeMae && (
                        <div>
                          <span className="text-xs text-muted-foreground">Nome da Mãe</span>
                          <p className="font-medium">{selectedCarteira.nomeMae}</p>
                        </div>
                      )}
                      {selectedCarteira.nomeAcompanhante && (
                        <div>
                          <span className="text-xs text-muted-foreground">Acompanhante</span>
                          <p className="font-medium">{selectedCarteira.nomeAcompanhante}</p>
                        </div>
                      )}
                      {selectedCarteira.tipoSanguineo && (
                        <div>
                          <span className="text-xs text-muted-foreground">Tipo Sanguíneo</span>
                          <p className="font-medium">{selectedCarteira.tipoSanguineo}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Address */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> Endereço
                    </h4>
                    <p className="text-sm">
                      {selectedCarteira.rua}, {selectedCarteira.numero}
                      {selectedCarteira.complemento ? ` - ${selectedCarteira.complemento}` : ""}, {selectedCarteira.bairro} — {selectedCarteira.cep}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedCarteira.cidade}/{selectedCarteira.estado}</p>
                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {selectedCarteira.telefone}
                    </div>
                  </div>

                  <Separator />

                  {/* Documents */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" /> Documentos Enviados
                    </h4>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <DocThumb label="Foto 3x4" url={selectedCarteira.fotoUrl} />
                      <DocThumb label="CPF" url={selectedCarteira.cpfDocUrl} />
                      <DocThumb label="RG / Certidão" url={selectedCarteira.rgDocUrl} />
                      <DocThumb label="Laudo Médico" url={selectedCarteira.laudoUrl} />
                      <DocThumb label="Comprovante" url={selectedCarteira.comprovanteUrl} />
                    </div>
                  </div>

                  <Separator />

                  {selectedCarteira.status === "negada" && selectedCarteira.motivoRejeicao && (
                    <div className="rounded-lg border border-autism-red/20 bg-autism-red/5 p-4">
                      <h4 className="mb-1 text-xs font-bold uppercase text-autism-red">Motivo da Rejeição</h4>
                      <p className="text-sm">{selectedCarteira.motivoRejeicao}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/carteira/${selectedCarteira.id}`}>
                      <Button size="sm" className="gap-1 puzzle-gradient">
                        <Eye className="h-3.5 w-3.5" />
                        Ver Carteira
                      </Button>
                    </Link>
                    {selectedCarteira.status !== "emitida" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => {
                          handleStatusChange(selectedCarteira.id, "emitida");
                          setSelectedCarteira({ ...selectedCarteira, status: "emitida", motivoRejeicao: null });
                        }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Aprovar
                      </Button>
                    )}
                    {selectedCarteira.status !== "negada" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-autism-red text-autism-red hover:bg-autism-red/5"
                        onClick={() => {
                          setRejectId(selectedCarteira.id);
                          setSelectedCarteira(null);
                        }}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Rejeitar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DocThumb({ label, url }: { label: string; url: string | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!url) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed p-3 text-center">
        <FileText className="h-6 w-6 text-muted-foreground/30" />
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="text-[9px] text-autism-red">Não enviado</span>
      </div>
    );
  }

  const isPdf = url.toLowerCase().endsWith(".pdf");

  return (
    <>
      <button
        onClick={() => setExpanded(true)}
        className="group flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition hover:border-autism-blue hover:shadow-md"
      >
        {isPdf ? (
          <FileText className="h-6 w-6 text-autism-red" />
        ) : (
          <div className="relative h-12 w-12 overflow-hidden rounded">
            <img src={url} alt={label} className="h-full w-full object-cover" />
          </div>
        )}
        <span className="text-[10px] font-medium group-hover:text-autism-blue">{label}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-xl bg-white p-2 shadow-2xl dark:bg-gray-900"
            >
              <Button size="icon" variant="ghost" className="absolute right-2 top-2 z-10" onClick={() => setExpanded(false)}>
                <X className="h-4 w-4" />
              </Button>
              <p className="mb-2 px-2 text-sm font-semibold">{label}</p>
              {isPdf ? (
                <iframe src={url} className="h-[75vh] w-[80vw] max-w-3xl rounded" title={label} />
              ) : (
                <img src={url} alt={label} className="max-h-[75vh] rounded object-contain" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { atualizarPerfil } from "@/lib/auth";
import { toast } from "sonner";

interface Props {
  usuario: {
    id: string;
    nome: string;
    email: string;
    cpf: string;
  };
}

export function PerfilClient({ usuario }: Props) {
  const router = useRouter();
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (novaSenha && novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      setLoading(false);
      return;
    }

    const result = await atualizarPerfil({
      nome,
      email,
      senhaAtual: senhaAtual || undefined,
      novaSenha: novaSenha || undefined,
    });

    if (result.success) {
      toast.success("Perfil atualizado com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      router.refresh();
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Back link */}
        <Link
          href="/minha-conta"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-autism-blue"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Minha Conta
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold">Editar Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Atualize suas informações pessoais
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-autism-blue" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input value={usuario.cpf} disabled className="bg-muted/30" />
                <p className="text-[11px] text-muted-foreground">
                  O CPF não pode ser alterado
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Password change */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-5 w-5 text-autism-blue" />
                Alterar Senha
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Deixe em branco para manter a senha atual
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senhaAtual">Senha Atual</Label>
                <Input
                  id="senhaAtual"
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <Input
                  id="novaSenha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Link href="/minha-conta">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="puzzle-gradient gap-2 font-semibold"
            >
              <Save className="h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

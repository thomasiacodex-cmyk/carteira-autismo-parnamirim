"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { KeyRound, Mail, CreditCard, ArrowLeft, CheckCircle2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { solicitarRecuperacaoSenha } from "@/lib/auth";
import { formatCPF, validateCPF } from "@/lib/utils";

export default function EsqueciSenhaPage() {
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!cpf || !email) {
      setError("Preencha todos os campos");
      return;
    }
    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      return;
    }

    setLoading(true);
    try {
      const result = await solicitarRecuperacaoSenha({ cpf, email });
      if (result.success) {
        setSuccess(true);
        toast.success("Verifique seu e-mail!");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Erro ao solicitar recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl">
            <CardContent className="flex flex-col items-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-autism-blue/10">
                <Send className="h-8 w-8 text-autism-blue" />
              </div>
              <h2 className="mb-2 text-xl font-bold">E-mail Enviado!</h2>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Se os dados informados estiverem corretos, você receberá um e-mail
                com um link para redefinir sua senha. O link expira em 1 hora.
              </p>
              <p className="mb-6 text-center text-xs text-muted-foreground">
                Verifique também sua caixa de spam.
              </p>
              <Link href="/login">
                <Button className="puzzle-gradient font-semibold">
                  Voltar para Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-1.5 w-24 overflow-hidden rounded-full">
              <div className="flex-1 bg-[#1E88E5]" />
              <div className="flex-1 bg-[#FDD835]" />
              <div className="flex-1 bg-[#EF476F]" />
              <div className="flex-1 bg-[#06D6A0]" />
            </div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-autism-yellow/10">
              <KeyRound className="h-8 w-8 text-autism-yellow" />
            </div>
            <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
            <p className="text-sm text-muted-foreground">
              Informe seu CPF e e-mail cadastrado. Enviaremos um link para
              redefinir sua senha.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">
                  CPF <span className="text-autism-red">*</span>
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  E-mail cadastrado <span className="text-autism-red">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md bg-autism-red/10 px-3 py-2 text-sm text-autism-red"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full puzzle-gradient text-base font-semibold"
                size="lg"
              >
                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-autism-blue">
                <ArrowLeft className="h-3 w-3" />
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

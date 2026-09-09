"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("emailVerificado") === "true") {
      toast.success("E-mail verificado com sucesso! Faça login.");
    }
    const erro = searchParams.get("erro");
    if (erro) {
      toast.error(decodeURIComponent(erro));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setError("Preencha todos os campos");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await login(email, senha);
      if (result.success) {
        toast.success("Login realizado com sucesso!");
        router.push("/minha-conta");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-3 text-center">
            {/* Puzzle ribbon */}
            <div className="mx-auto flex h-1.5 w-24 overflow-hidden rounded-full">
              <div className="flex-1 bg-[#1E88E5]" />
              <div className="flex-1 bg-[#FDD835]" />
              <div className="flex-1 bg-[#EF476F]" />
              <div className="flex-1 bg-[#06D6A0]" />
            </div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-autism-blue/10">
              <LogIn className="h-8 w-8 text-autism-blue" />
            </div>
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <p className="text-sm text-muted-foreground">
              Acesse sua conta para solicitar ou ver sua carteira
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
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

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
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
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <Link
                href="/esqueci-senha"
                className="text-sm text-muted-foreground hover:text-autism-blue hover:underline"
              >
                Esqueci minha senha
              </Link>
              <p className="text-sm text-muted-foreground">
                Não tem conta?{" "}
                <Link
                  href="/cadastro"
                  className="font-semibold text-autism-blue hover:underline"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

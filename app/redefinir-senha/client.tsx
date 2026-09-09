"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redefinirSenha } from "@/lib/auth";

export function RedefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center py-12">
            <p className="text-center text-muted-foreground">
              Link de recuperação inválido. Solicite um novo link na página de
              recuperação de senha.
            </p>
            <Button
              onClick={() => router.push("/esqueci-senha")}
              className="mt-4 puzzle-gradient font-semibold"
            >
              Ir para Recuperação
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (novaSenha.length < 6) {
      setError("Nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const result = await redefinirSenha({ token, novaSenha });
      if (result.success) {
        setSuccess(true);
        toast.success("Senha redefinida com sucesso!");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Erro ao redefinir senha. Tente novamente.");
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
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-autism-green/10">
                <CheckCircle2 className="h-8 w-8 text-autism-green" />
              </div>
              <h2 className="mb-2 text-xl font-bold">Senha Redefinida!</h2>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Sua senha foi atualizada com sucesso. Faça login com a nova
                senha.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="puzzle-gradient font-semibold"
              >
                Ir para Login
              </Button>
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
            <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
            <p className="text-sm text-muted-foreground">
              Digite sua nova senha abaixo
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="novaSenha">
                  Nova Senha <span className="text-autism-red">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="novaSenha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">
                  Confirmar Nova Senha{" "}
                  <span className="text-autism-red">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmarSenha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="pl-10"
                    autoComplete="new-password"
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
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

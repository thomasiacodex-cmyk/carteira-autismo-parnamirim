"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { UserPlus, Mail, Lock, Eye, EyeOff, User, CreditCard, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadDropzone } from "@/components/UploadDropzone";
import { registrar } from "@/lib/auth";
import { formatCPF, validateCPF } from "@/lib/utils";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [laudoUrl, setLaudoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nome || !email || !cpf || !senha) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }
    if (nome.length < 3) {
      setError("Nome deve ter pelo menos 3 caracteres");
      return;
    }
    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      return;
    }
    if (senha.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }
    if (!aceitouTermos) {
      setError("Você precisa aceitar os Termos de Uso e a Política de Privacidade");
      return;
    }
    if (!laudoUrl) {
      setError("Envie o laudo médico comprovando o diagnóstico de TEA");
      return;
    }

    setLoading(true);
    try {
      const result = await registrar({ nome, email, cpf, senha, laudoUrl });
      if (result.success) {
        toast.success("Conta criada com sucesso!");
        router.push("/minha-conta");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-autism-green/10">
              <UserPlus className="h-8 w-8 text-autism-green" />
            </div>
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <p className="text-sm text-muted-foreground">
              Cadastre-se para solicitar sua CIPTEA
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome Completo <span className="text-autism-red">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  E-mail <span className="text-autism-red">*</span>
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
                <Label htmlFor="senha">
                  Senha <span className="text-autism-red">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
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

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">
                  Confirmar Senha <span className="text-autism-red">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmarSenha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repita a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Laudo médico */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-autism-blue" />
                  <Label>
                    Laudo Médico (TEA) <span className="text-autism-red">*</span>
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Envie o laudo médico com CID comprovando o diagnóstico de Transtorno do Espectro Autista.
                  Aceitos: JPG, PNG ou PDF (máx. 5MB).
                </p>
                <UploadDropzone
                  label="Laudo Médico com CID (TEA)"
                  required
                  onFile={() => {}}
                  onUploadComplete={(url) => setLaudoUrl(url)}
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="termos"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 accent-autism-blue"
                />
                <label htmlFor="termos" className="text-xs text-muted-foreground">
                  Li e aceito os{" "}
                  <Link href="/termos" className="font-semibold text-autism-blue hover:underline" target="_blank">
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" className="font-semibold text-autism-blue hover:underline" target="_blank">
                    Política de Privacidade
                  </Link>{" "}
                  (LGPD). <span className="text-autism-red">*</span>
                </label>
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
                className="w-full bg-autism-green text-base font-semibold text-white hover:bg-autism-green/90"
                size="lg"
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-autism-blue hover:underline"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

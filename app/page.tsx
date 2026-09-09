"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Smartphone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PuzzlePieces } from "@/components/PuzzlePieces";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Shield,
    title: "Seguro e Legal",
    description:
      "Baseado na Lei Romeo Mion (nº 13.977/2020). Documento oficial reconhecido.",
    color: "text-autism-blue",
    bg: "bg-autism-blue/10",
  },
  {
    icon: Clock,
    title: "Emissão Rápida",
    description:
      "Preencha o formulário e receba sua carteira digital em minutos.",
    color: "text-autism-green",
    bg: "bg-autism-green/10",
  },
  {
    icon: Smartphone,
    title: "100% Digital",
    description:
      "Acesse sua CIPTEA pelo celular a qualquer momento. Baixe em PNG ou PDF.",
    color: "text-autism-yellow",
    bg: "bg-autism-yellow/10",
  },
  {
    icon: Heart,
    title: "Acessível",
    description:
      "Interface pensada para todos, com acessibilidade e navegação simplificada.",
    color: "text-autism-red",
    bg: "bg-autism-red/10",
  },
];

export default function HomePage() {
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("carteira-id");
    if (id) setSavedId(id);
  }, []);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 md:pt-24">
        <PuzzlePieces />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              {/* Logo Prefeitura */}
              <div className="mx-auto mb-6 flex justify-center">
                <div className="rounded-2xl bg-autism-darkblue/90 px-6 py-3 shadow-lg">
                  <Image
                    src="/logo-branca.png"
                    alt="Prefeitura de Parnamirim"
                    width={280}
                    height={80}
                    className="h-16 w-auto md:h-20"
                    priority
                  />
                </div>
              </div>

              {/* Autism ribbon */}
              <div className="mx-auto mb-6 flex h-2 w-32 overflow-hidden rounded-full">
                <div className="flex-1 bg-[#1E88E5]" />
                <div className="flex-1 bg-[#FDD835]" />
                <div className="flex-1 bg-[#EF476F]" />
                <div className="flex-1 bg-[#06D6A0]" />
              </div>

              <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
                Carteira do{" "}
                <span className="bg-gradient-to-r from-autism-blue to-autism-darkblue bg-clip-text text-transparent">
                  Autismo
                </span>
              </h1>
              <p className="text-xl font-medium text-autism-blue md:text-2xl">
                Parnamirim/RN — CIPTEA Digital
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 max-w-2xl text-lg text-muted-foreground"
            >
              Emissão e renovação digital da Carteira de Identificação da Pessoa
              com Transtorno do Espectro Autista. Rápido, seguro e gratuito.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/solicitar">
                <Button
                  size="xl"
                  className="group puzzle-gradient text-lg font-bold shadow-xl shadow-autism-blue/25 transition-all hover:shadow-2xl hover:shadow-autism-blue/30"
                >
                  Solicitar ou Renovar Carteira
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {savedId && (
                <Link href={`/carteira/${savedId}`}>
                  <Button
                    size="xl"
                    variant="outline"
                    className="border-2 border-autism-blue text-autism-blue hover:bg-autism-blue/5"
                  >
                    Ver Minha Carteira
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-gray-50/50 px-4 py-16 dark:bg-gray-950/50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold">Como funciona?</h2>
            <p className="text-muted-foreground">
              Processo simples em 3 passos para obter sua CIPTEA
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 bg-white/70 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900/70">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${feature.bg}`}
                    >
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <h3 className="mb-2 font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold">Passo a Passo</h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Preencha seus dados pessoais",
                description:
                  "Informe seu nome, CPF, data de nascimento e envie uma foto 3x4.",
                color: "bg-autism-blue",
              },
              {
                step: "02",
                title: "Envie os documentos",
                description:
                  "Faça upload do CPF, RG/Certidão, laudo médico com CID e informe o CRM.",
                color: "bg-autism-yellow",
              },
              {
                step: "03",
                title: "Receba sua carteira digital",
                description:
                  "Após preencher seu endereço, sua CIPTEA é emitida instantaneamente!",
                color: "bg-autism-green",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-6"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color} text-lg font-bold text-white shadow-lg`}
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="puzzle-gradient p-8 text-center text-white md:p-12">
                <div className="mx-auto mb-4 flex h-1.5 w-20 overflow-hidden rounded-full">
                  <div className="flex-1 bg-white/40" />
                  <div className="flex-1 bg-[#FDD835]" />
                  <div className="flex-1 bg-[#EF476F]" />
                  <div className="flex-1 bg-[#06D6A0]" />
                </div>
                <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                  Pronto para emitir sua carteira?
                </h2>
                <p className="mb-6 text-white/80">
                  O processo leva menos de 5 minutos. Tenha seus documentos em
                  mãos.
                </p>
                <Link href="/solicitar">
                  <Button
                    size="xl"
                    className="bg-white font-bold text-autism-blue shadow-xl hover:bg-white/90"
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

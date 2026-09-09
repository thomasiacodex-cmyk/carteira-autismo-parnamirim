"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Scale,
  Shield,
  Accessibility,
  GraduationCap,
  Stethoscope,
  Bus,
  Briefcase,
  Users,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const direitos = [
  {
    icon: Accessibility,
    title: "Atendimento Prioritário",
    desc: "Prioridade em filas de bancos, hospitais, serviços públicos e estabelecimentos comerciais.",
    color: "text-autism-blue",
    bg: "bg-autism-blue/10",
  },
  {
    icon: Stethoscope,
    title: "Acesso à Saúde",
    desc: "Diagnóstico precoce, terapias multidisciplinares (ABA, fonoaudiologia, TO) pelo SUS e planos de saúde.",
    color: "text-autism-green",
    bg: "bg-autism-green/10",
  },
  {
    icon: GraduationCap,
    title: "Educação Inclusiva",
    desc: "Direito a acompanhante especializado, adaptação curricular e sala de recursos multifuncionais.",
    color: "text-autism-yellow",
    bg: "bg-autism-yellow/10",
  },
  {
    icon: Bus,
    title: "Transporte Gratuito",
    desc: "Passe livre no transporte público municipal e intermunicipal em diversos estados.",
    color: "text-autism-red",
    bg: "bg-autism-red/10",
  },
  {
    icon: Briefcase,
    title: "Mercado de Trabalho",
    desc: "Cotas em empresas com mais de 100 empregados (Lei nº 8.213/91) e proteção contra discriminação.",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    icon: Shield,
    title: "BPC/LOAS",
    desc: "Benefício de Prestação Continuada de 1 salário mínimo para famílias de baixa renda.",
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

const leis = [
  {
    nome: "Lei Romeo Mion (nº 13.977/2020)",
    descricao:
      "Cria a CIPTEA — Carteira de Identificação da Pessoa com Transtorno do Espectro Autista. Garante identificação nacional e acesso prioritário a serviços públicos e privados.",
  },
  {
    nome: "Lei Berenice Piana (nº 12.764/2012)",
    descricao:
      "Institui a Política Nacional de Proteção dos Direitos da Pessoa com TEA. Equipara autistas a pessoas com deficiência para todos os efeitos legais.",
  },
  {
    nome: "Estatuto da Pessoa com Deficiência (nº 13.146/2015)",
    descricao:
      "Assegura direitos fundamentais como acessibilidade, educação, trabalho, saúde e cultura em igualdade com os demais cidadãos.",
  },
  {
    nome: "Lei nº 8.899/1994 — Passe Livre",
    descricao:
      "Concede passe livre no transporte coletivo interestadual às pessoas com deficiência comprovadamente carentes.",
  },
];

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-autism-blue/10">
          <Heart className="h-8 w-8 text-autism-blue" />
        </div>
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">
          Sobre a <span className="text-autism-blue">CIPTEA</span>
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          A Carteira de Identificação da Pessoa com Transtorno do Espectro
          Autista (CIPTEA) é um documento oficial que garante identificação e
          acesso a direitos previstos em lei.
        </p>
      </motion.div>

      {/* What is CIPTEA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-autism-blue/10">
                <BookOpen className="h-6 w-6 text-autism-blue" />
              </div>
              <div>
                <h2 className="mb-3 text-xl font-bold">O que é a CIPTEA?</h2>
                <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Criada pela <strong>Lei nº 13.977/2020</strong>, conhecida
                    como <strong>Lei Romeo Mion</strong>, a CIPTEA é a Carteira
                    de Identificação da Pessoa com Transtorno do Espectro Autista. Ela
                    serve como documento oficial para garantir atenção integral,
                    prioridade no atendimento e acesso a serviços públicos e
                    privados.
                  </p>
                  <p>
                    O nome da lei é uma homenagem a <strong>Romeo Mion</strong>,
                    filho do apresentador Marcos Mion, diagnosticado com autismo.
                    A luta da família por visibilidade e direitos impulsionou a
                    aprovação da legislação no Congresso Nacional.
                  </p>
                  <p>
                    A carteira tem <strong>validade de 5 anos</strong> e deve
                    conter: nome completo, foto, CPF, CID (Classificação
                    Internacional de Doenças), data de nascimento e informações
                    do responsável legal, quando aplicável.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Rights */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="mb-6 flex items-center gap-3">
          <Scale className="h-6 w-6 text-autism-blue" />
          <h2 className="text-2xl font-bold">Direitos da Pessoa com TEA</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {direitos.map((d, i) => (
            <motion.div
              key={d.title}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Card className="h-full border-0 shadow-md transition hover:shadow-lg">
                <CardContent className="flex gap-4 p-5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${d.bg}`}
                  >
                    <d.icon className={`h-5 w-5 ${d.color}`} />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-bold">{d.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {d.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Legislation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <div className="mb-6 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-autism-blue" />
          <h2 className="text-2xl font-bold">Legislação</h2>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="divide-y p-0">
            {leis.map((lei) => (
              <div key={lei.nome} className="px-6 py-5">
                <h3 className="mb-1.5 text-sm font-bold text-autism-blue">
                  {lei.nome}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {lei.descricao}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.section>

      {/* Autism awareness */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="puzzle-gradient px-8 py-6 text-white">
            <div className="flex items-center gap-3">
              <Users className="h-7 w-7" />
              <h2 className="text-xl font-bold">
                Sobre o Transtorno do Espectro Autista
              </h2>
            </div>
          </div>
          <CardContent className="space-y-3 p-8 text-sm leading-relaxed text-muted-foreground">
            <p>
              O <strong>Transtorno do Espectro Autista (TEA)</strong> é uma
              condição de neurodesenvolvimento caracterizada por diferenças na
              comunicação social, padrões de comportamento e interesses. Cada
              pessoa autista é única — daí o termo &quot;espectro&quot;.
            </p>
            <p>
              Segundo a <strong>OMS</strong>, estima-se que 1 em cada 100
              crianças no mundo está no espectro autista. No Brasil, isso
              representa cerca de <strong>2 milhões de pessoas</strong>.
            </p>
            <p>
              O diagnóstico precoce e o acesso a terapias adequadas são
              fundamentais para o desenvolvimento e qualidade de vida. A CIPTEA
              é uma ferramenta importante para garantir que esses direitos sejam
              respeitados.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Abril Azul", "2 de Abril — Dia Mundial", "Neurodiversidade", "Inclusão"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-autism-blue/10 px-3 py-1 text-xs font-medium text-autism-blue"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Separator className="mb-8" />
        <h3 className="mb-3 text-lg font-bold">
          Solicite sua CIPTEA agora mesmo
        </h3>
        <p className="mb-5 text-sm text-muted-foreground">
          O processo é 100% digital e gratuito para moradores de Parnamirim/RN.
        </p>
        <Link href="/solicitar">
          <Button size="lg" className="puzzle-gradient px-8 font-semibold">
            Solicitar Carteira
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

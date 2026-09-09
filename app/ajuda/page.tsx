"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  FileText,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    category: "Geral",
    question: "O que é a CIPTEA?",
    answer:
      "A CIPTEA (Carteira de Identificação da Pessoa com Transtorno do Espectro Autista) é um documento oficial criado pela Lei nº 13.977/2020 (Lei Romeo Mion) que garante à pessoa com TEA identificação e acesso prioritário a serviços públicos e privados.",
  },
  {
    category: "Geral",
    question: "Quem tem direito à CIPTEA?",
    answer:
      "Toda pessoa diagnosticada com Transtorno do Espectro Autista (TEA), de qualquer idade, residente em Parnamirim/RN. O laudo médico com CID (F84.0 ou similar) é obrigatório.",
  },
  {
    category: "Geral",
    question: "A carteira é gratuita?",
    answer:
      "Sim! A emissão da CIPTEA é totalmente gratuita, conforme determina a legislação. Não há nenhuma taxa ou cobrança para solicitar a carteira.",
  },
  {
    category: "Documentos",
    question: "Quais documentos são necessários?",
    answer:
      "São necessários: foto 3x4 recente, documento de identidade (RG), CPF, laudo médico atualizado com CID (emitido por psiquiatra ou neurologista), comprovante de residência de Parnamirim/RN e, para menores de idade, documento do responsável legal.",
  },
  {
    category: "Documentos",
    question: "O laudo médico precisa ser recente?",
    answer:
      "Recomendamos que o laudo seja o mais atualizado possível. Não há prazo de validade definido por lei para o laudo, mas laudos mais recentes facilitam a análise e aprovação.",
  },
  {
    category: "Documentos",
    question: "Quais formatos de arquivo são aceitos?",
    answer:
      "São aceitos arquivos nos formatos JPG, PNG e PDF. Cada arquivo pode ter no máximo 5MB. As fotos devem estar nítidas e legíveis.",
  },
  {
    category: "Processo",
    question: "Como funciona o processo de solicitação?",
    answer:
      "O processo é 100% digital: 1) Crie seu cadastro no sistema; 2) Preencha o formulário com seus dados pessoais; 3) Envie os documentos necessários; 4) Aguarde a análise; 5) Após aprovação, sua carteira digital estará disponível com QR Code de verificação.",
  },
  {
    category: "Processo",
    question: "Quanto tempo demora a análise?",
    answer:
      "O prazo médio de análise é de até 10 dias úteis após o envio de toda a documentação. Você receberá atualizações sobre o status da sua solicitação na página 'Minha Conta'.",
  },
  {
    category: "Processo",
    question: "Minha solicitação foi negada. O que fazer?",
    answer:
      "Se sua solicitação foi negada, verifique o motivo informado e corrija a documentação. Você pode fazer uma nova solicitação a qualquer momento com os documentos atualizados.",
  },
  {
    category: "Carteira",
    question: "Qual a validade da carteira?",
    answer:
      "A CIPTEA tem validade de 5 (cinco) anos a partir da data de emissão, conforme estabelecido pela Lei Romeo Mion.",
  },
  {
    category: "Carteira",
    question: "A carteira digital tem a mesma validade da física?",
    answer:
      "Sim! A carteira digital emitida por este sistema tem a mesma validade legal que a versão física. O QR Code presente na carteira pode ser escaneado por qualquer pessoa para verificar sua autenticidade.",
  },
  {
    category: "Carteira",
    question: "Como faço para renovar minha carteira?",
    answer:
      "Quando a carteira estiver próxima do vencimento, acesse o sistema e faça uma nova solicitação com documentação atualizada. Recomendamos solicitar a renovação com 30 dias de antecedência.",
  },
  {
    category: "Carteira",
    question: "Posso baixar minha carteira em PDF?",
    answer:
      "Sim! Após a emissão, você pode baixar sua carteira nos formatos PNG e PDF para imprimir ou salvar no celular. Basta acessar a carteira e clicar nos botões de exportação.",
  },
];

const categories = ["Geral", "Documentos", "Processo", "Carteira"];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md dark:bg-gray-900"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <span className="text-sm font-semibold">{item.question}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t px-5 py-4" id={`faq-answer-${index}`} role="region">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function AjudaPage() {
  const [activeCategory, setActiveCategory] = useState("Geral");

  const filteredItems = faqItems.filter((item) => item.category === activeCategory);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-autism-blue/10">
          <HelpCircle className="h-8 w-8 text-autism-blue" />
        </div>
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">
          Central de <span className="text-autism-blue">Ajuda</span>
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Encontre respostas para as dúvidas mais frequentes sobre a CIPTEA e o
          processo de solicitação.
        </p>
      </motion.div>

      {/* Category tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-wrap justify-center gap-2"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-autism-blue text-white shadow-md"
                : "bg-gray-100 text-muted-foreground hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            }`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* FAQ List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-12"
      >
        <FAQAccordion items={filteredItems} />
      </motion.div>

      <Separator className="mb-10" />

      {/* Contact section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <h2 className="mb-6 text-center text-xl font-bold">
          Não encontrou o que procura?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-0 shadow-md transition hover:shadow-lg">
            <CardContent className="flex flex-col items-center py-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-autism-blue/10">
                <Phone className="h-5 w-5 text-autism-blue" />
              </div>
              <h3 className="mb-1 text-sm font-bold">Telefone</h3>
              <p className="text-xs text-muted-foreground">(84) 3644-8000</p>
              <p className="text-[10px] text-muted-foreground">
                Seg a Sex, 8h às 14h
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md transition hover:shadow-lg">
            <CardContent className="flex flex-col items-center py-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-autism-green/10">
                <Mail className="h-5 w-5 text-autism-green" />
              </div>
              <h3 className="mb-1 text-sm font-bold">E-mail</h3>
              <p className="text-xs text-muted-foreground">
                ciptea@parnamirim.rn.gov.br
              </p>
              <p className="text-[10px] text-muted-foreground">
                Resposta em até 48h
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md transition hover:shadow-lg">
            <CardContent className="flex flex-col items-center py-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-autism-yellow/10">
                <MapPin className="h-5 w-5 text-autism-yellow" />
              </div>
              <h3 className="mb-1 text-sm font-bold">Presencial</h3>
              <p className="text-xs text-muted-foreground">SEMIDH — Parnamirim</p>
              <p className="text-[10px] text-muted-foreground">
                Seg a Sex, 8h às 14h
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* CTA */}
      <div className="text-center">
        <Link href="/solicitar">
          <Button size="lg" className="puzzle-gradient px-8 font-semibold">
            Solicitar Carteira
          </Button>
        </Link>
      </div>
    </div>
  );
}

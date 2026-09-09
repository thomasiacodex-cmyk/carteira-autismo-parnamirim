"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-autism-blue/10">
            <FileText className="h-6 w-6 text-autism-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Termos de Uso</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Abril de 2026</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground">
              Ao utilizar o sistema de emissão da Carteira de Identificação da Pessoa com Transtorno do Espectro Autista (CIPTEA)
              de Parnamirim/RN, você concorda com os presentes Termos de Uso. Caso não concorde, não utilize o sistema.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">2. Finalidade do Sistema</h2>
            <p className="text-muted-foreground">
              Este sistema tem como finalidade exclusiva a emissão digital da CIPTEA, conforme previsto na Lei Federal nº 13.977/2020
              (Lei Romeo Mion) e na Lei Estadual do Rio Grande do Norte. A carteira serve como documento de identificação complementar
              para pessoas diagnosticadas com Transtorno do Espectro Autista (TEA).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">3. Cadastro e Veracidade</h2>
            <p className="text-muted-foreground">
              O usuário é responsável pela veracidade e exatidão de todas as informações fornecidas no cadastro e na solicitação
              da carteira. A prestação de informações falsas configura crime previsto no art. 299 do Código Penal Brasileiro.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">4. Documentos Enviados</h2>
            <p className="text-muted-foreground">
              Os documentos enviados (foto 3x4, CPF, RG/Certidão de Nascimento, laudo médico e comprovante de residência)
              são utilizados exclusivamente para fins de verificação e emissão da CIPTEA. Não serão compartilhados com terceiros
              sem autorização legal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">5. Validade da Carteira</h2>
            <p className="text-muted-foreground">
              A CIPTEA digital emitida por este sistema tem validade de 5 (cinco) anos a partir da data de emissão. Após o vencimento,
              uma nova solicitação deverá ser feita.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">6. Uso Adequado</h2>
            <p className="text-muted-foreground">
              O usuário compromete-se a utilizar o sistema de forma adequada, não realizando tentativas de acesso indevido,
              adulteração de dados, ou qualquer prática que comprometa a segurança e integridade do sistema.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">7. Disponibilidade</h2>
            <p className="text-muted-foreground">
              A Prefeitura de Parnamirim/RN não garante disponibilidade ininterrupta do sistema, podendo haver períodos
              de manutenção ou indisponibilidade técnica sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">8. Alterações</h2>
            <p className="text-muted-foreground">
              Estes termos podem ser alterados a qualquer momento. As alterações entram em vigor a partir da publicação
              no sistema. O uso continuado após alterações implica aceitação dos novos termos.
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao início
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

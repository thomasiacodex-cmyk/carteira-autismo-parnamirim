"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-autism-green/10">
            <Shield className="h-6 w-6 text-autism-green" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Política de Privacidade</h1>
            <p className="text-sm text-muted-foreground">Última atualização: Abril de 2026</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">1. Introdução</h2>
            <p className="text-muted-foreground">
              Esta Política de Privacidade descreve como o sistema CIPTEA Digital de Parnamirim/RN coleta, utiliza,
              armazena e protege os dados pessoais dos usuários, em conformidade com a Lei Geral de Proteção de Dados
              Pessoais (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">2. Dados Coletados</h2>
            <p className="text-muted-foreground">Para a emissão da CIPTEA, coletamos:</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li><strong>Dados de identificação:</strong> nome completo, CPF, data de nascimento, nome da mãe</li>
              <li><strong>Dados de saúde:</strong> CID (Classificação Internacional de Doenças), tipo sanguíneo, CRM do médico</li>
              <li><strong>Dados de contato:</strong> endereço completo, telefone, e-mail</li>
              <li><strong>Documentos digitalizados:</strong> foto 3x4, documento de CPF, RG ou certidão de nascimento, laudo médico, comprovante de residência</li>
              <li><strong>Dados de acesso:</strong> e-mail e senha criptografada</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">3. Base Legal</h2>
            <p className="text-muted-foreground">
              O tratamento de dados pessoais é realizado com base no cumprimento de obrigação legal (Lei nº 13.977/2020)
              e no consentimento do titular, conforme Art. 7º da LGPD. O tratamento de dados sensíveis (dados de saúde)
              é fundamentado na tutela da saúde e no cumprimento de obrigação legal, conforme Art. 11 da LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">4. Finalidade</h2>
            <p className="text-muted-foreground">Os dados coletados são utilizados exclusivamente para:</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Emissão e validação da CIPTEA digital</li>
              <li>Verificação de autenticidade via QR Code</li>
              <li>Comunicação sobre o status da solicitação</li>
              <li>Cumprimento de obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">5. Armazenamento e Segurança</h2>
            <p className="text-muted-foreground">
              Os dados são armazenados em banco de dados local com criptografia de senhas (scrypt). Adotamos medidas
              técnicas e administrativas para proteção contra acesso não autorizado, destruição, perda ou alteração
              dos dados pessoais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">6. Compartilhamento</h2>
            <p className="text-muted-foreground">
              Os dados pessoais <strong>não são compartilhados</strong> com terceiros, exceto quando exigido por
              determinação legal ou judicial. A verificação pública via QR Code exibe apenas dados mínimos
              (nome, validade e status da carteira).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">7. Direitos do Titular</h2>
            <p className="text-muted-foreground">Conforme a LGPD, o titular dos dados tem direito a:</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Confirmação da existência de tratamento de dados</li>
              <li>Acesso aos dados pessoais</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Portabilidade dos dados</li>
              <li>Eliminação dos dados tratados com consentimento</li>
              <li>Revogação do consentimento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">8. Retenção</h2>
            <p className="text-muted-foreground">
              Os dados serão mantidos enquanto a CIPTEA estiver válida e pelo período adicional necessário ao
              cumprimento de obrigações legais. Após esse período, os dados serão eliminados de forma segura.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-autism-darkblue">9. Contato</h2>
            <p className="text-muted-foreground">
              Para exercer seus direitos ou tirar dúvidas sobre o tratamento de dados pessoais, entre em contato
              com a Secretaria de Saúde de Parnamirim/RN ou envie um e-mail para{" "}
              <span className="font-semibold text-autism-blue">ciptea@parnamirim.rn.gov.br</span>.
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

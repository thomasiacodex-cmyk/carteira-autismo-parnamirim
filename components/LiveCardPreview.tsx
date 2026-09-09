"use client";

import { format, addYears } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LiveCardPreviewProps {
  nomeCompleto: string;
  cpf: string;
  cid: string;
  fotoUrl: string | null;
  dataNascimento: string;
  nomeMae: string;
  localNascimento: string;
  tipoSanguineo: string;
  endereco: string;
  nomeAcompanhante?: string;
  crmMedico?: string;
}

export function LiveCardPreview({
  nomeCompleto,
  cpf,
  cid,
  fotoUrl,
  dataNascimento,
  nomeMae,
  localNascimento,
  tipoSanguineo,
  endereco,
  nomeAcompanhante,
  crmMedico,
}: LiveCardPreviewProps) {
  const hoje = new Date();
  const validade = format(addYears(hoje, 5), "dd/MM/yyyy", { locale: ptBR });

  const nascFormatado = dataNascimento
    ? (() => {
        try {
          const d = new Date(dataNascimento);
          return format(d, "dd/MM/yyyy", { locale: ptBR });
        } catch {
          return "—";
        }
      })()
    : "—";

  return (
    <div className="space-y-4">
      <h3 className="text-center text-lg font-bold uppercase tracking-widest text-foreground">
        Pré-visualização
      </h3>
      <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        {/* Puzzle ribbon top */}
        <div className="flex h-2.5">
          <div className="flex-1 bg-[#1E88E5]" />
          <div className="flex-1 bg-[#FDD835]" />
          <div className="flex-1 bg-[#EF476F]" />
          <div className="flex-1 bg-[#06D6A0]" />
          <div className="flex-1 bg-[#118AB2]" />
        </div>

        {/* Card Header - Blue section */}
        <div className="card-gradient px-5 pb-5 pt-4">
          <div className="flex items-start gap-4">
            {/* Photo */}
            <div className="shrink-0">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt="Foto 3x4"
                  className="h-[90px] w-[72px] rounded-lg border-2 border-white/20 object-cover shadow-md"
                />
              ) : (
                <div className="flex h-[90px] w-[72px] items-center justify-center rounded-lg border-2 border-dashed border-white/30 bg-white/10">
                  <span className="text-center text-[10px] font-medium text-white/50">
                    Foto 3×4
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                República Federativa do Brasil
              </p>
              <p className="mt-0.5 text-base font-bold leading-tight text-white">
                {nomeCompleto || "Nome Completo"}
              </p>
              <div className="mt-2 inline-block rounded-full bg-[#FDD835] px-3 py-0.5">
                <span className="text-[11px] font-bold text-gray-900">
                  CIPTEA
                </span>
              </div>
              <p className="mt-1 text-[9px] leading-tight text-white/60">
                Carteira de Identificação da Pessoa
                <br />
                com Transtorno do Espectro Autista
              </p>
            </div>

            {/* QR Placeholder */}
            <div className="shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/90 p-1.5">
                <svg viewBox="0 0 100 100" className="h-full w-full text-gray-700">
                  <rect x="5" y="5" width="30" height="30" rx="2" fill="currentColor" />
                  <rect x="65" y="5" width="30" height="30" rx="2" fill="currentColor" />
                  <rect x="5" y="65" width="30" height="30" rx="2" fill="currentColor" />
                  <rect x="12" y="12" width="16" height="16" rx="1" fill="white" />
                  <rect x="72" y="12" width="16" height="16" rx="1" fill="white" />
                  <rect x="12" y="72" width="16" height="16" rx="1" fill="white" />
                  <rect x="17" y="17" width="6" height="6" fill="currentColor" />
                  <rect x="77" y="17" width="6" height="6" fill="currentColor" />
                  <rect x="17" y="77" width="6" height="6" fill="currentColor" />
                  <rect x="42" y="5" width="8" height="8" fill="currentColor" />
                  <rect x="42" y="20" width="8" height="8" fill="currentColor" />
                  <rect x="55" y="42" width="8" height="8" fill="currentColor" />
                  <rect x="70" y="42" width="8" height="8" fill="currentColor" />
                  <rect x="42" y="42" width="8" height="8" fill="currentColor" />
                  <rect x="85" y="42" width="8" height="8" fill="currentColor" />
                  <rect x="42" y="55" width="8" height="8" fill="currentColor" />
                  <rect x="65" y="65" width="8" height="8" fill="currentColor" />
                  <rect x="80" y="65" width="8" height="8" fill="currentColor" />
                  <rect x="65" y="80" width="8" height="8" fill="currentColor" />
                  <rect x="80" y="80" width="8" height="8" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3">
            <div>
              <img
                src="/logo-branca.png"
                alt="Prefeitura de Parnamirim"
                className="h-7 w-auto"
              />
              <p className="mt-0.5 text-[8px] text-white/50">
                Secretaria Municipal de Políticas Públicas
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/70">
                CID: <span className="font-bold text-white">{cid || "F84.0"}</span>
              </p>
              <p className="text-[10px] text-white/70">
                CPF: <span className="font-medium text-white/90">{cpf || "000.000.000-00"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card Body - White section */}
        <div className="px-5 py-4">
          <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-foreground">
            Dados de Cadastro
          </h4>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Validade
              </p>
              <p className="text-sm font-bold text-foreground">{validade}</p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Nascimento
              </p>
              <p className="text-xs font-medium text-foreground">
                {nascFormatado}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Local Nasc.
              </p>
              <p className="text-xs font-medium text-foreground">
                {localNascimento || "—"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Nome da Mãe
              </p>
              <p className="text-xs font-medium text-foreground">
                {nomeMae || "—"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tipo Sanguíneo
              </p>
              <p className="text-xs font-medium text-foreground">
                {tipoSanguineo || "—"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Endereço
              </p>
              <p className="text-xs font-medium text-foreground">
                {endereco || "—"}
              </p>
            </div>
            {nomeAcompanhante ? (
              <div className="col-span-2">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Acompanhante
                </p>
                <p className="text-xs font-medium text-foreground">
                  {nomeAcompanhante}
                </p>
              </div>
            ) : null}
            {crmMedico ? (
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  CRM Médico
                </p>
                <p className="text-xs font-medium text-foreground">
                  {crmMedico}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom ribbon */}
        <div className="flex h-2.5">
          <div className="flex-1 bg-[#1E88E5]" />
          <div className="flex-1 bg-[#FDD835]" />
          <div className="flex-1 bg-[#EF476F]" />
          <div className="flex-1 bg-[#06D6A0]" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Carteira } from "@/lib/schema";

interface CardPreviewProps {
  carteira: Carteira;
}

export function CardPreview({ carteira }: CardPreviewProps) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const url = `${baseUrl}/verificar/${carteira.id}`;
    QRCode.toDataURL(url, {
      width: 120,
      margin: 1,
      color: { dark: "#0A4A8A", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, [carteira.id]);

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="carteira-card" className="mx-auto w-full max-w-[420px] p-4 bg-white dark:bg-gray-900">
      {/* Frente da carteira */}
      <div className="overflow-hidden rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="card-gradient relative px-5 pb-4 pt-4">
          {/* Puzzle ribbon */}
          <div className="absolute left-0 right-0 top-0 flex h-2">
            <div className="flex-1 bg-[#1E88E5]" />
            <div className="flex-1 bg-[#FDD835]" />
            <div className="flex-1 bg-[#EF476F]" />
            <div className="flex-1 bg-[#06D6A0]" />
            <div className="flex-1 bg-[#118AB2]" />
          </div>

          <div className="mt-2 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                {/* Puzzle icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 100 100"
                  className="shrink-0"
                >
                  <path
                    d="M50 0 C50 0, 65 0, 65 0 C65 0, 65 10, 75 10 C85 10, 85 0, 85 0 L100 0 L100 35 C100 35, 90 35, 90 45 C90 55, 100 55, 100 55 L100 100 L65 100 C65 100, 65 90, 55 90 C45 90, 45 100, 45 100 L0 100 L0 65 C0 65, 10 65, 10 55 C10 45, 0 45, 0 45 L0 0 Z"
                    fill="#FDD835"
                    opacity="0.9"
                  />
                </svg>
                <div>
                  <h2 className="text-sm font-bold leading-tight text-white">
                    CIPTEA
                  </h2>
                  <p className="text-[10px] leading-tight text-white/70">
                    Carteira de Identificação da
                  </p>
                  <p className="text-[10px] leading-tight text-white/70">
                    Pessoa com Transtorno do
                  </p>
                  <p className="text-[10px] leading-tight text-white/70">
                    Espectro Autista
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <img
                src="/logo-branca.png"
                alt="Prefeitura de Parnamirim"
                className="h-8 w-auto"
              />
              <p className="mt-0.5 text-[8px] text-white/50">
                Secretaria SEMIDH
              </p>
            </div>
          </div>

          {/* Photo + Info */}
          <div className="mt-3 flex gap-4">
            <div className="shrink-0">
              {carteira.fotoUrl ? (
                <img
                  src={carteira.fotoUrl}
                  alt={`Foto de ${carteira.nomeCompleto}`}
                  className="h-24 w-20 rounded-lg border-2 border-white/30 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-20 items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 text-white/50">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50">
                  Nome Completo
                </p>
                <p className="text-base font-bold leading-tight text-white">
                  {carteira.nomeCompleto}
                </p>
              </div>
              <div className="mt-1 flex gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/50">
                    CID
                  </p>
                  <p className="text-sm font-semibold text-[#FDD835]">
                    {carteira.cid}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/50">
                    CPF
                  </p>
                  <p className="text-xs font-medium text-white/90">
                    {carteira.cpf}
                  </p>
                </div>
              </div>
            </div>
            {/* QR Code */}
            <div className="flex flex-col items-center">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code de verificação"
                  className="h-20 w-20 rounded-lg bg-white p-1"
                />
              )}
              <p className="mt-1 text-[7px] text-white/40">Verificação</p>
            </div>
          </div>
        </div>

        {/* Dados de cadastro */}
        <div className="bg-white px-5 py-4 dark:bg-gray-900">
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-autism-blue">
            Dados de Cadastro
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <InfoRow
              label="Validade"
              value={formatDate(carteira.dataValidade)}
            />
            <InfoRow
              label="Emissão"
              value={formatDate(carteira.dataEmissao)}
            />
            <InfoRow
              label="Nascimento"
              value={formatDate(carteira.dataNascimento)}
            />
            <InfoRow
              label="Tipo Sanguíneo"
              value={carteira.tipoSanguineo || "—"}
            />
            <InfoRow
              label="Local de Nascimento"
              value={carteira.localNascimento || "Parnamirim/RN"}
              full
            />
            <InfoRow
              label="Nome da Mãe"
              value={carteira.nomeMae || "—"}
              full
            />
            <InfoRow
              label="Endereço"
              value={`${carteira.rua}, ${carteira.numero}${carteira.complemento ? ` - ${carteira.complemento}` : ""}, ${carteira.bairro} - ${carteira.cidade}/${carteira.estado}`}
              full
            />
          </div>

          {/* Bottom ribbon */}
          <div className="mt-4 flex h-1.5 overflow-hidden rounded-full">
            <div className="flex-1 bg-[#1E88E5]" />
            <div className="flex-1 bg-[#FDD835]" />
            <div className="flex-1 bg-[#EF476F]" />
            <div className="flex-1 bg-[#06D6A0]" />
          </div>

          <p className="mt-2 text-center text-[8px] text-muted-foreground">
            ID: {carteira.id} • Lei nº 13.977/2020 (Lei Romeo Mion)
          </p>
        </div>
      </div>
      <canvas ref={qrRef} className="hidden" />
    </div>
  );
}

export function CardPreviewExportWrapper({ carteira }: CardPreviewProps) {
  return <CardPreview carteira={carteira} />;
}

function InfoRow({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-xs font-medium text-foreground">{value}</p>
    </div>
  );
}

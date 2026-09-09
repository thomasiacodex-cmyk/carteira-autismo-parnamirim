import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white/50 dark:bg-gray-950/50" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 100 100">
                <path
                  d="M50 0 C50 0, 65 0, 65 0 C65 0, 65 10, 75 10 C85 10, 85 0, 85 0 L100 0 L100 35 C100 35, 90 35, 90 45 C90 55, 100 55, 100 55 L100 100 L65 100 C65 100, 65 90, 55 90 C45 90, 45 100, 45 100 L0 100 L0 65 C0 65, 10 65, 10 55 C10 45, 0 45, 0 45 L0 0 Z"
                  fill="#1E88E5"
                />
              </svg>
              <span className="text-sm font-semibold text-autism-blue">
                CIPTEA Digital
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Carteira de Identificação da Pessoa com Transtorno do Espectro Autista — Parnamirim/RN
            </p>
            <div className="flex h-1 w-24 overflow-hidden rounded-full">
              <div className="flex-1 bg-[#1E88E5]" />
              <div className="flex-1 bg-[#FDD835]" />
              <div className="flex-1 bg-[#EF476F]" />
              <div className="flex-1 bg-[#06D6A0]" />
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Links</h4>
            <Link href="/sobre" className="text-xs text-muted-foreground hover:text-autism-blue hover:underline">Sobre a CIPTEA</Link>
            <Link href="/ajuda" className="text-xs text-muted-foreground hover:text-autism-blue hover:underline">Ajuda / FAQ</Link>
            <Link href="/termos" className="text-xs text-muted-foreground hover:text-autism-blue hover:underline">Termos de Uso</Link>
            <Link href="/privacidade" className="text-xs text-muted-foreground hover:text-autism-blue hover:underline">Política de Privacidade</Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Legal</h4>
            <p className="text-xs text-muted-foreground">Lei nº 13.977/2020 (Lei Romeo Mion)</p>
            <p className="text-xs text-muted-foreground">Lei nº 12.764/2012 (Lei Berenice Piana)</p>
            <p className="text-xs text-muted-foreground">LGPD — Lei nº 13.709/2018</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Prefeitura de Parnamirim/RN — Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}

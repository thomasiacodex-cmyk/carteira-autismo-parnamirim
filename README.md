---
title: Carteira Autismo Parnamirim
emoji: 🧩
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# 🧩 Carteira do Autismo — Parnamirim/RN

Aplicação web moderna para emissão e renovação da **CIPTEA** (Carteira de Identificação da Pessoa com Transtorno do Espectro Autista) — baseada na **Lei Romeo Mion (nº 13.977/2020)**.

## Stack

- **Next.js 15** (App Router + Server Actions)
- **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui**
- **React Hook Form** + **Zod**
- **Drizzle ORM** + **SQLite** (zero-config)
- **Framer Motion** (animações)
- **html-to-image** + **jsPDF** (exportação)
- **QRCode** (verificação)
- **Zustand** (estado)
- **Sonner** (notificações)

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Abrir no navegador
open http://localhost:3000
```

O banco de dados SQLite é criado automaticamente no arquivo `local.db`.

## Estrutura

```
app/
  page.tsx            → Landing page
  solicitar/page.tsx  → Formulário multi-step (3 passos)
  carteira/[id]/      → Visualização da carteira digital
  admin/page.tsx      → Painel administrativo
  api/verify/[id]/    → API de verificação via QR code
components/
  CardPreview.tsx     → Renderização da carteira
  FormStepper.tsx     → Stepper do formulário
  UploadDropzone.tsx  → Upload de arquivos
  PuzzlePieces.tsx    → Animações do autismo
lib/
  db.ts               → Conexão com SQLite via Drizzle
  schema.ts           → Schema do banco de dados
  validations.ts      → Validações Zod
  actions.ts          → Server Actions
  store.ts            → Estado global (Zustand)
  utils.ts            → Utilitários
```

## Área Administrativa

Acesse `/admin` com a senha: `natal123`

## Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | Linting |
| `npm run format` | Formatação com Prettier |
| `npm run db:push` | Push do schema para o banco |
| `npm run db:studio` | Drizzle Studio |

## Licença

MIT

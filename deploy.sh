#!/bin/bash
# =============================================================
# Script de deploy — CIPTEA Digital Parnamirim
# Execute na VPS Hostinger após enviar os arquivos
# Uso: ./deploy.sh
# =============================================================
set -e

APP_NAME="ciptea-parnamirim"

echo ""
echo "🧩 CIPTEA Digital — Deploy para Produção"
echo "=========================================="

# 0. Verificar .env
if [ ! -f .env ]; then
  echo "❌ Arquivo .env não encontrado!"
  echo "   Copie .env.example para .env e preencha os valores:"
  echo "   cp .env.example .env && nano .env"
  exit 1
fi

# Verificar variáveis obrigatórias
source .env
if [ -z "$SESSION_SECRET" ] || [ "$SESSION_SECRET" = "COLE_AQUI_O_RESULTADO_DO_OPENSSL" ]; then
  echo "❌ SESSION_SECRET não configurado no .env!"
  echo "   Gere com: openssl rand -hex 32"
  exit 1
fi

# 1. Instalar TODAS as dependências (precisa das devDeps pro build)
echo ""
echo "📦 [1/6] Instalando dependências..."
npm ci

# 2. Recompilar better-sqlite3 para esta plataforma
echo ""
echo "🔧 [2/6] Compilando módulos nativos para esta plataforma..."
npm rebuild better-sqlite3

# 3. Build de produção
echo ""
echo "🔨 [3/6] Gerando build de produção (standalone)..."
npx next build

# 4. Montar o diretório standalone
echo ""
echo "📁 [4/6] Copiando arquivos para standalone..."

# Copiar estáticos (Next.js não faz isso automaticamente)
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# Copiar .env para dentro do standalone
cp .env .next/standalone/.env

# Recompilar better-sqlite3 DENTRO do standalone
echo "   → Recompilando better-sqlite3 no standalone..."
cd .next/standalone
npm rebuild better-sqlite3 2>/dev/null || true
cd ../..

# Garantir que o diretório de uploads exista na raiz do projeto
mkdir -p uploads

# Criar links simbólicos no standalone (remover primeiro para evitar link dentro de diretório)
rm -rf .next/standalone/uploads
ln -s "$(pwd)/uploads" .next/standalone/uploads

# Symlinks para o banco de dados (arquivos podem não existir ainda — tudo bem)
rm -f .next/standalone/local.db .next/standalone/local.db-shm .next/standalone/local.db-wal
ln -s "$(pwd)/local.db" .next/standalone/local.db 2>/dev/null || true

# 5. Criar diretórios auxiliares
echo ""
echo "📂 [5/6] Criando diretórios auxiliares..."
mkdir -p logs
mkdir -p backups

# 6. Iniciar/reiniciar com PM2
echo ""
echo "🚀 [6/6] Iniciando servidor com PM2..."
if command -v pm2 &> /dev/null; then
  if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    pm2 restart "$APP_NAME"
    echo "   ✅ Servidor reiniciado!"
  else
    pm2 start ecosystem.config.js
    pm2 save
    echo "   ✅ Servidor iniciado pela primeira vez!"
  fi
else
  echo "   ⚠️  PM2 não instalado. Instalando..."
  npm install -g pm2
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup systemd -u "$(whoami)" --hp "$HOME" || true
  echo "   ✅ PM2 instalado e servidor iniciado!"
fi

echo ""
echo "=========================================="
echo "✅ Deploy concluído!"
echo ""
echo "🌐 App rodando em http://localhost:${PORT:-3000}"
echo ""
echo "📋 Comandos úteis:"
echo "   pm2 status              — status do app"
echo "   pm2 logs $APP_NAME      — logs em tempo real"
echo "   pm2 restart $APP_NAME   — reiniciar"
echo "   pm2 monit               — monitor interativo"
echo "=========================================="

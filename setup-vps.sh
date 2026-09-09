#!/bin/bash
# =============================================================
# Setup inicial da VPS — Execute UMA VEZ no servidor novo
# Uso: curl -sL <url-raw-deste-arquivo> | bash
#  ou: chmod +x setup-vps.sh && ./setup-vps.sh
# =============================================================
set -e

echo ""
echo "🧩 CIPTEA Digital — Setup da VPS"
echo "================================="

# 1. Atualizar sistema
echo ""
echo "📦 [1/5] Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar Node.js 20
echo ""
echo "🟢 [2/5] Instalando Node.js 20..."
if ! command -v node &> /dev/null || [[ $(node -v | cut -d. -f1 | tr -d 'v') -lt 18 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
echo "   Node $(node -v) instalado"
echo "   npm $(npm -v)"

# 3. Instalar build tools (necessário para better-sqlite3)
echo ""
echo "🔧 [3/5] Instalando ferramentas de compilação..."
apt install -y build-essential python3 git

# 4. Instalar PM2
echo ""
echo "🔄 [4/5] Instalando PM2..."
npm install -g pm2

# 5. Instalar Nginx
echo ""
echo "🌐 [5/5] Instalando Nginx..."
apt install -y nginx

# Configurar firewall
if command -v ufw &> /dev/null; then
  ufw allow 'Nginx Full'
  ufw allow OpenSSH
  echo "   Firewall configurado"
fi

echo ""
echo "================================="
echo "✅ VPS configurada!"
echo ""
echo "Próximos passos:"
echo "  1. Envie os arquivos do projeto para /home/ciptea/"
echo "  2. cd /home/ciptea"
echo "  3. cp .env.example .env && nano .env"
echo "  4. ./deploy.sh"
echo ""
echo "Para SSL gratuito (depois de configurar DNS):"
echo "  apt install certbot python3-certbot-nginx"
echo "  certbot --nginx -d seudominio.com.br"
echo "================================="

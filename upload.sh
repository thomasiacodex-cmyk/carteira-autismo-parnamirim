#!/bin/bash
# =============================================================
# Script de upload — envie os arquivos do Mac para a VPS Hostinger
# Execute no SEU MAC antes de fazer o deploy
#
# Uso:   ./upload.sh root@SEU_IP_VPS
# Ex:    ./upload.sh root@185.123.45.67
#
# O que este script faz:
#   - Envia todos os arquivos-fonte para /home/ciptea/ na VPS
#   - Exclui node_modules, .next (build), banco de dados e .env
#   - Mantém as permissões dos scripts de deploy
# =============================================================
set -e

REMOTE="${1:-}"
REMOTE_PATH="/home/ciptea"
LOCAL_PATH="$(cd "$(dirname "$0")" && pwd)"

if [ -z "$REMOTE" ]; then
  echo ""
  echo "❌ Informe o IP ou host da VPS:"
  echo "   ./upload.sh root@SEU_IP_VPS"
  echo ""
  exit 1
fi

echo ""
echo "🧩 CIPTEA Digital — Upload para Hostinger VPS"
echo "==============================================="
echo "   De:   $LOCAL_PATH"
echo "   Para: $REMOTE:$REMOTE_PATH"
echo ""

# Cria o diretório remoto se não existir
ssh "$REMOTE" "mkdir -p $REMOTE_PATH"

# Envia os arquivos (exclui o que não deve ir para o servidor)
rsync -avz --progress \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '*.db' \
  --exclude '*.db-shm' \
  --exclude '*.db-wal' \
  --exclude '.env' \
  --exclude 'uploads/*' \
  --exclude '!uploads/.gitkeep' \
  --exclude 'logs/' \
  --exclude 'backups/' \
  --exclude '.DS_Store' \
  "$LOCAL_PATH/" \
  "$REMOTE:$REMOTE_PATH/"

# Garante que os scripts tenham permissão de execução
ssh "$REMOTE" "chmod +x $REMOTE_PATH/deploy.sh $REMOTE_PATH/setup-vps.sh"

echo ""
echo "==============================================="
echo "✅ Arquivos enviados com sucesso!"
echo ""
echo "Agora na VPS execute:"
echo "  ssh $REMOTE"
echo "  cd $REMOTE_PATH"
echo ""
echo "  # Se for a PRIMEIRA vez na VPS:"
echo "  sudo ./setup-vps.sh"
echo ""
echo "  # Configure o .env com seus dados reais:"
echo "  cp .env.example .env && nano .env"
echo ""
echo "  # Faça o deploy:"
echo "  ./deploy.sh"
echo "==============================================="

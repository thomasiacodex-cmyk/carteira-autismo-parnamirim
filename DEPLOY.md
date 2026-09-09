# Deploy na Hostinger — CIPTEA Digital Parnamirim

## Requisitos

- **Plano**: VPS Hostinger com Node.js (KVM 1 ou superior)
- **Node.js**: 18.x ou 20.x
- **Acesso SSH**: habilitado no painel Hostinger

---

## Passo a Passo

### 1. Configurar VPS na Hostinger

No painel da Hostinger:
1. Vá em **VPS** → **Configurações** → **Sistema Operacional**
2. Escolha **Ubuntu 22.04 com Node.js** (ou instale Node manualmente)
3. Ative o acesso **SSH**
4. Anote o **IP** e as credenciais de acesso

### 2. Acessar a VPS via SSH

```bash
ssh root@SEU_IP_DA_VPS
```

### 3. Instalar dependências do sistema

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20 (se não veio pré-instalado)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar PM2 globalmente
npm install -g pm2

# Instalar build tools para better-sqlite3
apt install -y build-essential python3
```

### 4. Enviar os arquivos do projeto

**Opção A — Via Git (recomendado):**
```bash
cd /home
git clone https://seu-repositorio.git ciptea
cd ciptea
```

**Opção B — Via SCP do seu Mac:**
```bash
# No seu Mac, execute:
rsync -avz --exclude node_modules --exclude .next --exclude '*.db' \
  /Users/abimaelsilva/Documents/carteiraautismo/ \
  root@SEU_IP:/home/ciptea/
```

### 5. Configurar variáveis de ambiente

```bash
cd /home/ciptea

# Copiar template e editar
cp .env.example .env
nano .env
```

**Preencha com seus dados reais:**

```env
DATABASE_URL=./local.db
NEXT_PUBLIC_APP_URL=https://seudominio.com.br
PORT=3000
SESSION_SECRET=   # Cole aqui: openssl rand -hex 32
ADMIN_PASSWORD=   # Senha forte para /admin
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@seudominio.com.br
SMTP_PASSWORD=sua-senha
EMAIL_FROM=CIPTEA Parnamirim <noreply@seudominio.com.br>
NODE_ENV=production
```

Para gerar o SESSION_SECRET:
```bash
openssl rand -hex 32
```

### 6. Executar o deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

Isso vai:
- Instalar dependências
- Gerar o build de produção
- Copiar arquivos estáticos
- Iniciar o servidor com PM2

### 7. Configurar domínio (proxy reverso)

Instale e configure o Nginx como proxy reverso:

```bash
apt install -y nginx
```

Crie o arquivo de configuração:

```bash
nano /etc/nginx/sites-available/ciptea
```

Cole:

```nginx
server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;

    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seudominio.com.br www.seudominio.com.br;

    # SSL (Certbot vai preencher)
    ssl_certificate /etc/letsencrypt/live/seudominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com.br/privkey.pem;

    # Limite de upload (5MB para documentos)
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar e reiniciar:

```bash
ln -s /etc/nginx/sites-available/ciptea /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
```

### 8. SSL gratuito com Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
```

O Certbot renova automaticamente.

### 9. Configurar PM2 para iniciar no boot

```bash
pm2 startup systemd
# Execute o comando que ele mostrar
pm2 save
```

---

## Comandos Úteis

| Comando | O que faz |
|---------|-----------|
| `pm2 status` | Ver se o app está rodando |
| `pm2 logs ciptea-parnamirim` | Ver logs em tempo real |
| `pm2 restart ciptea-parnamirim` | Reiniciar o app |
| `pm2 stop ciptea-parnamirim` | Parar o app |
| `./deploy.sh` | Refazer deploy após mudanças |

## Atualizar o site

Após fazer alterações no código:

```bash
cd /home/ciptea
git pull          # ou re-enviar via rsync
./deploy.sh       # rebuild + restart
```

## Backup do banco de dados

```bash
# Backup manual
cp /home/ciptea/local.db /home/ciptea/backups/local-$(date +%F).db

# Cron automático (diário às 3h)
crontab -e
# Adicione:
0 3 * * * cp /home/ciptea/local.db /home/ciptea/backups/local-$(date +\%F).db
```

---

## Checklist pré-deploy

- [ ] `SESSION_SECRET` gerado com `openssl rand -hex 32`
- [ ] `ADMIN_PASSWORD` com senha forte (não `natal123`)
- [ ] `NEXT_PUBLIC_APP_URL` apontando para o domínio real com `https://`
- [ ] SMTP configurado (testar envio de e-mail)
- [ ] Domínio apontando para o IP da VPS (DNS A record)
- [ ] SSL configurado (HTTPS)
- [ ] PM2 configurado para iniciar no boot
- [ ] Backup automático do banco configurado

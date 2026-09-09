import nodemailer from "nodemailer";

let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return _transporter;
}

const FROM_ADDRESS =
  process.env.EMAIL_FROM || "CIPTEA Parnamirim <noreply@ciptea.parnamirim.rn.gov.br>";

async function sendEmail(to: string, subject: string, html: string) {
  // Skip sending in development if no SMTP configured
  if (!process.env.SMTP_USER) {
    console.log(`[EMAIL] Para: ${to} | Assunto: ${subject}`);
    console.log(`[EMAIL] HTML: ${html.substring(0, 200)}...`);
    return { success: true, preview: true };
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("[EMAIL] Erro ao enviar:", error);
    return { success: false, error };
  }
}

export async function enviarEmailVerificacao(
  email: string,
  nome: string,
  token: string,
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = `${appUrl}/api/verificar-email?token=${token}`;

  return sendEmail(
    email,
    "Confirme seu e-mail — CIPTEA Parnamirim",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-flex; height: 6px; width: 96px; border-radius: 4px; overflow: hidden;">
          <div style="flex: 1; background: #1E88E5;"></div>
          <div style="flex: 1; background: #FDD835;"></div>
          <div style="flex: 1; background: #EF476F;"></div>
          <div style="flex: 1; background: #06D6A0;"></div>
        </div>
      </div>
      <h2 style="color: #1E88E5;">Olá, ${nome}!</h2>
      <p>Obrigado por se cadastrar na <strong>CIPTEA Digital — Parnamirim/RN</strong>.</p>
      <p>Para confirmar seu e-mail, clique no botão abaixo:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}" style="background: linear-gradient(135deg, #1E88E5, #06D6A0); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Confirmar E-mail
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">Se você não criou uma conta, ignore este e-mail.</p>
      <p style="color: #666; font-size: 14px;">Este link expira em 24 horas.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">CIPTEA Digital — Prefeitura de Parnamirim/RN</p>
    </div>
    `,
  );
}

export async function enviarEmailRecuperacaoSenha(
  email: string,
  nome: string,
  token: string,
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = `${appUrl}/redefinir-senha?token=${token}`;

  return sendEmail(
    email,
    "Redefinir Senha — CIPTEA Parnamirim",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-flex; height: 6px; width: 96px; border-radius: 4px; overflow: hidden;">
          <div style="flex: 1; background: #1E88E5;"></div>
          <div style="flex: 1; background: #FDD835;"></div>
          <div style="flex: 1; background: #EF476F;"></div>
          <div style="flex: 1; background: #06D6A0;"></div>
        </div>
      </div>
      <h2 style="color: #1E88E5;">Olá, ${nome}!</h2>
      <p>Recebemos uma solicitação para redefinir sua senha na <strong>CIPTEA Digital</strong>.</p>
      <p>Clique no botão abaixo para criar uma nova senha:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}" style="background: linear-gradient(135deg, #FDD835, #EF476F); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Redefinir Senha
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">Se você não solicitou, ignore este e-mail. Sua senha permanecerá inalterada.</p>
      <p style="color: #666; font-size: 14px;">Este link expira em 1 hora.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">CIPTEA Digital — Prefeitura de Parnamirim/RN</p>
    </div>
    `,
  );
}

export async function enviarEmailStatusCarteira(
  email: string,
  nome: string,
  status: "emitida" | "em_analise" | "negada",
  carteiraId: string,
  motivoRejeicao?: string,
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const statusLabels = {
    emitida: "Aprovada",
    em_analise: "Em Análise",
    negada: "Negada",
  };
  const statusColors = {
    emitida: "#06D6A0",
    em_analise: "#FDD835",
    negada: "#EF476F",
  };

  let bodyExtra = "";
  if (status === "emitida") {
    bodyExtra = `
      <p>Sua carteira CIPTEA está <strong style="color: #06D6A0;">aprovada e disponível</strong>!</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${appUrl}/carteira/${carteiraId}" style="background: linear-gradient(135deg, #1E88E5, #06D6A0); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Ver Minha Carteira
        </a>
      </div>
    `;
  } else if (status === "negada") {
    bodyExtra = `
      <p>Infelizmente, sua solicitação de carteira CIPTEA foi <strong style="color: #EF476F;">negada</strong>.</p>
      ${motivoRejeicao ? `<p><strong>Motivo:</strong> ${motivoRejeicao}</p>` : ""}
      <p>Você pode entrar em contato conosco ou solicitar uma nova carteira.</p>
    `;
  } else {
    bodyExtra = `
      <p>Sua carteira CIPTEA está <strong style="color: #FDD835;">em análise</strong>. Você será notificado quando houver uma atualização.</p>
    `;
  }

  return sendEmail(
    email,
    `Carteira CIPTEA — ${statusLabels[status]}`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-flex; height: 6px; width: 96px; border-radius: 4px; overflow: hidden;">
          <div style="flex: 1; background: #1E88E5;"></div>
          <div style="flex: 1; background: #FDD835;"></div>
          <div style="flex: 1; background: #EF476F;"></div>
          <div style="flex: 1; background: #06D6A0;"></div>
        </div>
      </div>
      <h2 style="color: ${statusColors[status]};">Status: ${statusLabels[status]}</h2>
      <p>Olá, ${nome}!</p>
      ${bodyExtra}
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">CIPTEA Digital — Prefeitura de Parnamirim/RN</p>
    </div>
    `,
  );
}

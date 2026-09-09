export function validateEnv() {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    errors.push("SESSION_SECRET não definida no .env");
  } else if (sessionSecret.length < 32) {
    errors.push(
      `SESSION_SECRET deve ter pelo menos 32 caracteres (atual: ${sessionSecret.length})`,
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    warnings.push("ADMIN_PASSWORD não definida no .env — acesso admin desabilitado");
  } else if (adminPassword === "natal123") {
    warnings.push(
      "ADMIN_PASSWORD está usando o valor padrão de desenvolvimento (natal123) — altere em produção",
    );
  } else if (adminPassword.length < 12) {
    warnings.push(`ADMIN_PASSWORD muito curta (${adminPassword.length} chars) — recomendado: mínimo 12`);
  }

  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv !== "development" && nodeEnv !== "production") {
    warnings.push(`NODE_ENV = "${nodeEnv}" (esperado: development ou production)`);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    warnings.push("NEXT_PUBLIC_APP_URL não definida — cookies podem não funcionar corretamente");
  } else if (nodeEnv === "production" && !appUrl.startsWith("https://")) {
    errors.push(
      `NEXT_PUBLIC_APP_URL deve usar HTTPS em produção (atual: ${appUrl})`,
    );
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  if (!smtpHost || !smtpUser) {
    warnings.push(
      "SMTP não configurado (SMTP_HOST, SMTP_USER) — e-mails serão silenciosamente ignorados",
    );
  }

  if (errors.length > 0) {
    console.error(
      "[ENV] Erros críticos de configuração — servidor não iniciará:\n" +
        errors.map((e) => `  ✗ ${e}`).join("\n"),
    );
    throw new Error(
      "Configuração inválida. Verifique as variáveis de ambiente.",
    );
  }

  if (warnings.length > 0) {
    console.warn(
      "[ENV] Avisos de configuração:\n" + warnings.map((w) => `  ⚠ ${w}`).join("\n"),
    );
  }

  console.log("[ENV] Validação concluída com sucesso");
}

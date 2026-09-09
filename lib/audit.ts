/**
 * Structured audit logging.
 * Writes to console (easily parseable by log aggregation tools).
 * Database audit trail via async operation (to avoid circular imports).
 */

export type AuditAction =
  | "user.register"
  | "user.login"
  | "user.login_failed"
  | "user.logout"
  | "user.update_profile"
  | "user.password_reset_request"
  | "user.password_reset"
  | "user.email_verified"
  | "user.data_export"
  | "user.data_delete"
  | "carteira.create"
  | "carteira.list"
  | "carteira.list_unauthorized"
  | "carteira.status_change"
  | "carteira.renew"
  | "carteira.view"
  | "carteira.print"
  | "admin.login"
  | "admin.login_failed"
  | "admin.status_change"
  | "upload.file"
  | "rate_limit.exceeded";

interface AuditEntry {
  action: AuditAction;
  userId?: string;
  ip?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export function audit(
  action: AuditAction,
  opts?: { userId?: string; ip?: string; details?: Record<string, unknown> },
) {
  const entry: AuditEntry = {
    action,
    userId: opts?.userId,
    ip: opts?.ip,
    details: opts?.details,
    timestamp: new Date().toISOString(),
  };

  console.log(JSON.stringify({ level: "audit", ...entry }));

  // Async DB insert to avoid circular dependency on db.ts
  // Import is deferred to avoid circular dependency at module load time
  Promise.resolve().then(async () => {
    try {
      const { db } = await import("@/lib/db");
      const { auditLogs } = await import("@/lib/schema");
      db.insert(auditLogs).values({
        action,
        userId: opts?.userId || null,
        ip: opts?.ip || null,
        details: opts?.details ? JSON.stringify(opts.details) : null,
      });
    } catch (err) {
      // Silently fail - audit logging is not critical
      console.error("[AUDIT] Erro ao registrar no banco:", err);
    }
  });
}

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import * as schema from "./schema";
import path from "path";
import { validateEnv } from "./env";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _envValidated = false;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const hashToVerify = scryptSync(password, salt, 64);
  if (hashBuffer.length !== hashToVerify.length) return false;
  return timingSafeEqual(hashBuffer, hashToVerify);
}

function initDb() {
  if (_db) return _db;

  if (!_envValidated) {
    validateEnv();
    _envValidated = true;
  }

  const dbPath = path.resolve(process.cwd(), "local.db");
  const sqlite = new Database(dbPath);

  // Enable WAL mode for better performance
  sqlite.pragma("journal_mode = WAL");
  // Enable foreign keys
  sqlite.pragma("foreign_keys = ON");

  _db = drizzle(sqlite, { schema });

  // Auto-create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      cpf TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      email_verificado INTEGER NOT NULL DEFAULT 0,
      email_verif_token TEXT,
      email_verif_expira INTEGER,
      reset_senha_token TEXT,
      reset_senha_expira INTEGER,
      laudo_url TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS carteiras (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
      nome_acompanhante TEXT,
      nome_completo TEXT NOT NULL,
      cpf TEXT NOT NULL,
      data_nascimento TEXT NOT NULL,
      foto_url TEXT,
      cpf_doc_url TEXT,
      rg_doc_url TEXT,
      laudo_url TEXT,
      cid TEXT NOT NULL,
      crm_medico TEXT NOT NULL,
      rua TEXT NOT NULL,
      numero TEXT NOT NULL,
      complemento TEXT,
      bairro TEXT NOT NULL,
      cep TEXT NOT NULL,
      cidade TEXT NOT NULL DEFAULT 'Parnamirim',
      estado TEXT NOT NULL DEFAULT 'RN',
      comprovante_url TEXT,
      telefone TEXT NOT NULL,
      nome_mae TEXT,
      local_nascimento TEXT,
      tipo_sanguineo TEXT,
      status TEXT NOT NULL DEFAULT 'em_analise' CHECK(status IN ('emitida','em_analise','negada')),
      motivo_rejeicao TEXT,
      data_emissao TEXT NOT NULL,
      data_validade TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      user_id TEXT,
      ip TEXT,
      details TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Add indexes for fast lookups (IF NOT EXISTS is safe to run repeatedly)
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf)`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_carteiras_user_id ON carteiras(user_id)`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_carteiras_cpf ON carteiras(cpf)`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_carteiras_status ON carteiras(status)`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`);

  // Migration-safe column additions
  try { sqlite.exec(`ALTER TABLE usuarios ADD COLUMN updated_at INTEGER NOT NULL DEFAULT (unixepoch())`); } catch { /* column already exists */ }
  try { sqlite.exec(`ALTER TABLE usuarios ADD COLUMN email_verificado INTEGER NOT NULL DEFAULT 0`); } catch { /* column already exists */ }
  try { sqlite.exec(`ALTER TABLE usuarios ADD COLUMN email_verif_token TEXT`); } catch { /* column already exists */ }
  try { sqlite.exec(`ALTER TABLE usuarios ADD COLUMN email_verif_expira INTEGER`); } catch { /* column already exists */ }
  try { sqlite.exec(`ALTER TABLE usuarios ADD COLUMN reset_senha_token TEXT`); } catch { /* column already exists */ }
  try { sqlite.exec(`ALTER TABLE usuarios ADD COLUMN reset_senha_expira INTEGER`); } catch { /* column already exists */ }
  try { sqlite.exec(`ALTER TABLE usuarios ADD COLUMN laudo_url TEXT`); } catch { /* column already exists */ }
  try { sqlite.exec(`ALTER TABLE carteiras ADD COLUMN updated_at INTEGER NOT NULL DEFAULT (unixepoch())`); } catch { /* column already exists */ }
  try { sqlite.exec(`ALTER TABLE carteiras ADD COLUMN motivo_rejeicao TEXT`); } catch { /* column already exists */ }

  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    const realDb = initDb();
    const value = Reflect.get(realDb, prop, receiver);
    if (typeof value === "function") {
      return value.bind(realDb);
    }
    return value;
  },
});

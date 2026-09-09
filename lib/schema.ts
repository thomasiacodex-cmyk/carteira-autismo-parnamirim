import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  cpf: text("cpf").notNull().unique(),
  senha: text("senha").notNull(),
  emailVerificado: integer("email_verificado", { mode: "boolean" })
    .notNull()
    .default(false),
  emailVerifToken: text("email_verif_token"),
  emailVerifExpira: integer("email_verif_expira"),
  resetSenhaToken: text("reset_senha_token"),
  resetSenhaExpira: integer("reset_senha_expira"),
  laudoUrl: text("laudo_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Usuario = typeof usuarios.$inferSelect;
export type NewUsuario = typeof usuarios.$inferInsert;

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  userId: text("user_id"),
  ip: text("ip"),
  details: text("details"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type AuditLog = typeof auditLogs.$inferSelect;

export const carteiras = sqliteTable("carteiras", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => usuarios.id, { onDelete: "set null" }),
  // Dados pessoais
  nomeAcompanhante: text("nome_acompanhante"),
  nomeCompleto: text("nome_completo").notNull(),
  cpf: text("cpf").notNull(),
  dataNascimento: text("data_nascimento").notNull(),
  fotoUrl: text("foto_url"),
  // Documentos
  cpfDocUrl: text("cpf_doc_url"),
  rgDocUrl: text("rg_doc_url"),
  laudoUrl: text("laudo_url"),
  cid: text("cid").notNull(),
  crmMedico: text("crm_medico").notNull(),
  // Endereço/Contato
  rua: text("rua").notNull(),
  numero: text("numero").notNull(),
  complemento: text("complemento"),
  bairro: text("bairro").notNull(),
  cep: text("cep").notNull(),
  cidade: text("cidade").notNull().default("Parnamirim"),
  estado: text("estado").notNull().default("RN"),
  comprovanteUrl: text("comprovante_url"),
  telefone: text("telefone").notNull(),
  // Dados extras carteira
  nomeMae: text("nome_mae"),
  localNascimento: text("local_nascimento"),
  tipoSanguineo: text("tipo_sanguineo"),
  // Metadados
  status: text("status", {
    enum: ["emitida", "em_analise", "negada"],
  })
    .notNull()
    .default("emitida"),
  motivoRejeicao: text("motivo_rejeicao"),
  dataEmissao: text("data_emissao").notNull(),
  dataValidade: text("data_validade").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Carteira = typeof carteiras.$inferSelect;
export type NewCarteira = typeof carteiras.$inferInsert;

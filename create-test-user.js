const Database = require("better-sqlite3");
const crypto = require("crypto");
const path = require("path");
const { randomUUID } = require("crypto");

// Initialize database
const db = new Database(path.join(__dirname, "local.db"));

// Hash password using scryptSync with salt:hash format (matches lib/db.ts)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Delete existing test user
db.exec("DELETE FROM usuarios WHERE email = 'teste@example.com'");

// Insert test user
const hashedPassword = hashPassword("senha123");
const userId = randomUUID();
const now = Math.floor(Date.now() / 1000); // SQLite timestamp (seconds)

const stmt = db.prepare(`
  INSERT INTO usuarios (id, nome, email, cpf, senha, email_verificado, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

stmt.run(
  userId,
  "Usuário Teste",
  "teste@example.com",
  "12345678900",
  hashedPassword,
  1, // email_verificado = true
  now,
  now
);

console.log("✅ Test user created with correct password hash format:");
console.log("   Email: teste@example.com");
console.log("   Password: senha123");
console.log("   CPF: 12345678900");

db.close();

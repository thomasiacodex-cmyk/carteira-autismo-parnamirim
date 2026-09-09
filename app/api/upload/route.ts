import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { getSession } from "@/lib/session";
import { checkRateLimit, RATE_LIMITS, getClientIp } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Store uploads outside of public/ for security
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export async function POST(request: Request) {
  try {
    // Rate limit check
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`upload:${ip}`, RATE_LIMITS.upload);
    if (!rateCheck.allowed) {
      audit("rate_limit.exceeded", { ip, details: { route: "upload" } });
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde alguns minutos." },
        { status: 429 },
      );
    }

    // Require authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login primeiro." },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPG, PNG ou PDF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo deve ter no máximo 5MB" },
        { status: 400 },
      );
    }

    // Generate safe filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const safeExt = ext.replace(/[^a-z0-9]/g, "");
    const uniqueName = `${randomBytes(16).toString("hex")}.${safeExt}`;

    await mkdir(UPLOADS_DIR, { recursive: true });

    const filePath = path.join(UPLOADS_DIR, uniqueName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    audit("upload.file", {
      userId: session.userId,
      details: { filename: file.name, size: file.size, type: file.type },
    });

    return NextResponse.json({
      url: `/api/files/${uniqueName}`,
      name: file.name,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar upload" },
      { status: 500 },
    );
  }
}

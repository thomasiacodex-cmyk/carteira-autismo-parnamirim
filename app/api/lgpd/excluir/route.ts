import { NextResponse } from "next/server";
import { getSession, deleteSession } from "@/lib/session";
import { db } from "@/lib/db";
import { usuarios, carteiras } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { audit } from "@/lib/audit";
import { unlink } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Fetch user's carteiras to clean up uploaded files
    const userCarteiras = await db
      .select()
      .from(carteiras)
      .where(eq(carteiras.userId, session.userId));

    // Clean up uploaded files
    const uploadsDir = path.join(process.cwd(), "uploads");
    for (const carteira of userCarteiras) {
      const fileUrls = [
        carteira.fotoUrl,
        carteira.cpfDocUrl,
        carteira.rgDocUrl,
        carteira.laudoUrl,
        carteira.comprovanteUrl,
      ].filter(Boolean);

      for (const fileUrl of fileUrls) {
        if (!fileUrl) continue;
        const filename = fileUrl.split("/").pop();
        if (filename && /^[a-f0-9]+\.(jpg|jpeg|png|pdf)$/i.test(filename)) {
          try {
            await unlink(path.join(uploadsDir, filename));
          } catch {
            // File may not exist, that's OK
          }
        }
      }
    }

    // Delete carteiras
    await db.delete(carteiras).where(eq(carteiras.userId, session.userId));

    // Delete user account
    await db.delete(usuarios).where(eq(usuarios.id, session.userId));

    audit("user.data_delete", { userId: session.userId });

    // Clear session
    await deleteSession();

    return NextResponse.json({
      success: true,
      message: "Todos os seus dados foram excluídos permanentemente.",
    });
  } catch (err) {
    console.error("Erro ao excluir dados:", err);
    return NextResponse.json(
      { error: "Erro ao processar exclusão. Entre em contato com o suporte." },
      { status: 500 },
    );
  }
}

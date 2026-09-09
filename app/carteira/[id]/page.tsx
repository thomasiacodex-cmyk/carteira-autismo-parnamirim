"use client";

import { Suspense } from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import {
  Download,
  FileImage,
  FileText,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardPreview } from "@/components/CardPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { buscarCarteiraProtegida } from "@/lib/actions";
import type { Carteira } from "@/lib/schema";

export default function CarteiraPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-12">
          <Skeleton className="mb-4 h-8 w-48" />
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
      }
    >
      <CarteiraContent />
    </Suspense>
  );
}

function CarteiraContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "true";
  const id = params.id as string;

  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [loading, setLoading] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const { carteira: data, allowed } = await buscarCarteiraProtegida(id);
      if (!data && !allowed) {
        setNotAllowed(true);
      }
      setCarteira(data);
      setLoading(false);

      if (isNew && data) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 6000);
      }
    }
    load();
  }, [id, isNew]);

  const exportAsPng = useCallback(async () => {
    const el = document.getElementById("carteira-card");
    if (!el) return;
    setExporting(true);
    try {
      // Force white background and ensure full capture
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "#FFFFFF",
        width: el.scrollWidth,
        height: el.scrollHeight,
        style: {
          overflow: "visible",
          margin: "0",
        },
      });
      const link = document.createElement("a");
      link.download = `CIPTEA-${id}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Carteira salva como PNG!");
    } catch {
      toast.error("Erro ao exportar. Tente novamente.");
    }
    setExporting(false);
  }, [id]);

  const exportAsPdf = useCallback(async () => {
    const el = document.getElementById("carteira-card");
    if (!el) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "#FFFFFF",
        width: el.scrollWidth,
        height: el.scrollHeight,
        style: {
          overflow: "visible",
          margin: "0",
        },
      });
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      // Create PDF sized to the card proportions
      const pdfWidth = 190; // mm (A4 usable width)
      const pdfHeight = (imgH * pdfWidth) / imgW;
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "p" : "l",
        unit: "mm",
        format: "a4",
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const x = (pageW - pdfWidth) / 2;

      pdf.addImage(dataUrl, "PNG", x, 15, pdfWidth, pdfHeight);
      pdf.save(`CIPTEA-${id}.pdf`);
      toast.success("Carteira salva como PDF!");
    } catch {
      toast.error("Erro ao exportar. Tente novamente.");
    }
    setExporting(false);
  }, [id]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Minha CIPTEA Digital",
          text: "Veja minha Carteira do Autismo digital!",
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    }
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!carteira) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="mb-4 text-2xl font-bold">
          {notAllowed ? "Acesso negado" : "Carteira não encontrada"}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {notAllowed
            ? "Você não tem permissão para visualizar esta carteira."
            : "O ID informado não corresponde a nenhuma carteira."}
        </p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-8">
      {showConfetti && (
        <ReactConfetti
          width={typeof window !== "undefined" ? window.innerWidth : 400}
          height={typeof window !== "undefined" ? window.innerHeight : 600}
          recycle={false}
          numberOfPieces={300}
          colors={["#1E88E5", "#FDD835", "#EF476F", "#06D6A0", "#118AB2"]}
        />
      )}

      <div className="mx-auto max-w-lg">
        {/* Success Banner */}
        {isNew && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-6"
          >
            <Card className="border-autism-green/30 bg-autism-green/5">
              <CardContent className="flex items-center gap-3 p-4">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-autism-green" />
                <div>
                  <p className="font-semibold text-autism-green">
                    Carteira emitida com sucesso!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sua CIPTEA digital está pronta. Você pode baixá-la abaixo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="mb-1 text-2xl font-bold">
            CIPTEA Digital
          </h1>
          <p className="text-sm text-muted-foreground">
            Carteira de Identificação — TEA
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardPreview carteira={carteira} />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          <Button
            onClick={exportAsPng}
            disabled={exporting}
            className="flex-col gap-1 py-6 puzzle-gradient"
          >
            {exporting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileImage className="h-5 w-5" />
            )}
            <span className="text-xs">PNG</span>
          </Button>
          <Button
            onClick={exportAsPdf}
            disabled={exporting}
            variant="outline"
            className="flex-col gap-1 border-2 border-autism-blue py-6 text-autism-blue hover:bg-autism-blue/5"
          >
            {exporting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            <span className="text-xs">PDF</span>
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-col gap-1 border-2 border-autism-green py-6 text-autism-green hover:bg-autism-green/5"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs">Compartilhar</span>
          </Button>
        </motion.div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

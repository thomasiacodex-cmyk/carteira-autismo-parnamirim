"use client";

import { useCallback, useState } from "react";
import { Upload, FileCheck, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  label: string;
  accept?: string;
  onFile: (file: File) => void;
  onUploadComplete?: (url: string) => void;
  preview?: string | null;
  required?: boolean;
}

export function UploadDropzone({
  label,
  accept = "image/*,.pdf",
  onFile,
  onUploadComplete,
  preview,
  required,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        setError("Arquivo deve ter no máximo 5MB");
        return;
      }
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Formato inválido. Use JPG, PNG ou PDF");
        return;
      }
      setError(null);
      setFileName(file.name);
      onFile(file);

      // Upload to server
      if (onUploadComplete) {
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            onUploadComplete(data.url);
          } else {
            const data = await res.json();
            setError(data.error || "Erro no upload");
          }
        } catch {
          setError("Erro ao enviar arquivo");
        } finally {
          setUploading(false);
        }
      }
    },
    [onFile, onUploadComplete],
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}{" "}
        {required && <span className="text-autism-red">*</span>}
      </label>
      <div
        className={cn(
          "relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all",
          isDragging
            ? "border-autism-blue bg-autism-blue/5"
            : fileName
              ? "border-autism-green bg-autism-green/5"
              : "border-gray-300 hover:border-autism-blue hover:bg-autism-blue/5 dark:border-gray-600",
          error && "border-autism-red bg-autism-red/5",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onClick={() => {
          if (uploading) return;
          const input = document.createElement("input");
          input.type = "file";
          input.accept = accept;
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFile(file);
          };
          input.click();
        }}
      >
        {uploading ? (
          <>
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-autism-blue" />
            <span className="text-sm font-medium text-autism-blue">
              Enviando...
            </span>
          </>
        ) : preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-20 rounded-full object-cover ring-2 ring-autism-blue"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
              }}
              className="absolute -right-1 -top-1 rounded-full bg-autism-red p-0.5 text-white"
              aria-label="Remover foto"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : fileName ? (
          <>
            <FileCheck className="mb-2 h-8 w-8 text-autism-green" />
            <span className="text-sm font-medium text-autism-green">
              {fileName}
            </span>
            <span className="text-xs text-muted-foreground">
              Clique para trocar
            </span>
          </>
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Arraste ou clique para enviar
            </span>
            <span className="text-xs text-muted-foreground">
              JPG, PNG ou PDF — máx. 5MB
            </span>
          </>
        )}
      </div>
      {error && <p className="text-xs text-autism-red">{error}</p>}
    </div>
  );
}

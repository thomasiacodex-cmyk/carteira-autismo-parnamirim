"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Send,
  User,
  Camera,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FormStepper } from "@/components/FormStepper";
import { UploadDropzone } from "@/components/UploadDropzone";
import { PuzzlePieces } from "@/components/PuzzlePieces";

import {
  step1Schema,
  step2Schema,
  step3Schema,
  type Step1Data,
  type Step2Data,
  type Step3Data,
} from "@/lib/validations";
import { formatCPF, formatPhone, formatCEP } from "@/lib/utils";
import { criarCarteira } from "@/lib/actions";
import { useFormStore } from "@/lib/store";
import { LiveCardPreview } from "@/components/LiveCardPreview";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function SolicitarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const { formData, setFormData } = useFormStore();

  // Track uploaded file URLs
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({});

  // Step 1 form
  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nomeAcompanhante: formData.nomeAcompanhante || "",
      nomeCompleto: formData.nomeCompleto || "",
      cpf: formData.cpf || "",
      dataNascimento: formData.dataNascimento || "",
      nomeMae: formData.nomeMae || "",
      localNascimento: formData.localNascimento || "",
      tipoSanguineo: formData.tipoSanguineo || "",
    },
  });

  // Step 2 form
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      cid: formData.cid || "",
      crmMedico: formData.crmMedico || "",
    },
  });

  // Step 3 form
  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      rua: formData.rua || "",
      numero: formData.numero || "",
      complemento: formData.complemento || "",
      bairro: formData.bairro || "",
      cep: formData.cep || "",
      cidade: formData.cidade || "Parnamirim",
      telefone: formData.telefone || "",
    },
  });

  const handleNext = async () => {
    if (step === 1) {
      const valid = await form1.trigger();
      if (!valid) return;
      setFormData(form1.getValues() as unknown as Record<string, string>);
    } else if (step === 2) {
      const valid = await form2.trigger();
      if (!valid) return;
      setFormData(form2.getValues() as unknown as Record<string, string>);
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const handlePrev = () => {
    if (step === 1) return;
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    const valid = await form3.trigger();
    if (!valid) return;

    // Validate required document uploads
    const missingDocs = [];
    if (!uploadedUrls.foto) missingDocs.push("Foto 3x4");
    if (!uploadedUrls.cpfDoc) missingDocs.push("CPF");
    if (!uploadedUrls.rgDoc) missingDocs.push("RG/Certidão");
    if (!uploadedUrls.laudo) missingDocs.push("Laudo Médico");
    if (!uploadedUrls.comprovante) missingDocs.push("Comprovante de Residência");

    if (missingDocs.length > 0) {
      toast.error(`Envie os documentos obrigatórios: ${missingDocs.join(", ")}`);
      return;
    }

    setIsSubmitting(true);

    const allData = {
      ...form1.getValues(),
      ...form2.getValues(),
      ...form3.getValues(),
      fotoUrl: uploadedUrls.foto,
      cpfDocUrl: uploadedUrls.cpfDoc,
      rgDocUrl: uploadedUrls.rgDoc,
      laudoUrl: uploadedUrls.laudo,
      comprovanteUrl: uploadedUrls.comprovante,
    } as Record<string, string>;

    try {
      const result = await criarCarteira(allData);
      if (result.success) {
        localStorage.setItem("carteira-id", result.id);
        toast.success("Carteira emitida com sucesso!");
        router.push(`/carteira/${result.id}?new=true`);
      } else {
        toast.error("Erro na validação dos dados. Verifique os campos.");
      }
    } catch {
      toast.error("Erro ao emitir carteira. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFotoUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setFotoPreview(url);
      };
      reader.readAsDataURL(file);

      // Also upload to server
      const fd = new FormData();
      fd.append("file", file);
      fetch("/api/upload", { method: "POST", body: fd })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            setUploadedUrls((prev) => ({ ...prev, foto: data.url }));
          }
        })
        .catch(() => {});
    },
    [],
  );

  const progressValue = ((step - 1) / 2) * 100;

  return (
    <div className="relative min-h-screen px-4 py-8">
      <PuzzlePieces />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-3xl font-bold">
            Solicitar{" "}
            <span className="bg-gradient-to-r from-autism-blue to-autism-darkblue bg-clip-text text-transparent">
              Carteira CIPTEA
            </span>
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para emitir sua carteira digital
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left Column - Form */}
          <div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progressValue} />
          <p className="mt-2 text-right text-xs text-muted-foreground">
            Passo {step} de 3
          </p>
        </div>

        {/* Stepper */}
        <FormStepper currentStep={step} />

        {/* Form Card */}
        <Card className="overflow-hidden border-0 shadow-xl">
          <CardHeader className="puzzle-gradient text-white">
            <CardTitle className="flex items-center gap-2 text-lg">
              {step === 1 && (
                <>
                  <User className="h-5 w-5" /> Dados Pessoais
                </>
              )}
              {step === 2 && (
                <>
                  <Send className="h-5 w-5" /> Documentos
                </>
              )}
              {step === 3 && (
                <>
                  <Send className="h-5 w-5" /> Endereço e Contato
                </>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <AnimatePresence mode="wait" custom={direction}>
              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Photo Upload */}
                  <div className="flex justify-center">
                    <div className="relative">
                      {fotoPreview ? (
                        <img
                          src={fotoPreview}
                          alt="Foto 3x4"
                          className="h-28 w-28 rounded-full border-4 border-autism-blue object-cover shadow-lg"
                        />
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <label
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-autism-blue text-white shadow-lg transition hover:bg-autism-darkblue"
                        aria-label="Enviar foto 3x4"
                      >
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFotoUpload(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    Foto 3x4 do PCD (obrigatória)
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="nomeAcompanhante">
                      Nome do Acompanhante{" "}
                      <span className="text-xs text-muted-foreground">
                        (opcional)
                      </span>
                    </Label>
                    <Input
                      id="nomeAcompanhante"
                      placeholder="Nome completo do acompanhante"
                      {...form1.register("nomeAcompanhante")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomeCompleto">
                      Nome Completo do PCD{" "}
                      <span className="text-autism-red">*</span>
                    </Label>
                    <Input
                      id="nomeCompleto"
                      placeholder="Nome completo"
                      {...form1.register("nomeCompleto")}
                    />
                    {form1.formState.errors.nomeCompleto && (
                      <p className="text-xs text-autism-red">
                        {form1.formState.errors.nomeCompleto.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">
                        CPF do PCD{" "}
                        <span className="text-autism-red">*</span>
                      </Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={form1.watch("cpf")}
                        onChange={(e) =>
                          form1.setValue("cpf", formatCPF(e.target.value), {
                            shouldValidate: true,
                          })
                        }
                      />
                      {form1.formState.errors.cpf && (
                        <p className="text-xs text-autism-red">
                          {form1.formState.errors.cpf.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">
                        Data de Nascimento{" "}
                        <span className="text-autism-red">*</span>
                      </Label>
                      <Input
                        id="dataNascimento"
                        type="date"
                        {...form1.register("dataNascimento")}
                      />
                      {form1.formState.errors.dataNascimento && (
                        <p className="text-xs text-autism-red">
                          {form1.formState.errors.dataNascimento.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomeMae">
                      Nome da Mãe{" "}
                      <span className="text-xs text-muted-foreground">
                        (opcional)
                      </span>
                    </Label>
                    <Input
                      id="nomeMae"
                      placeholder="Nome completo da mãe"
                      {...form1.register("nomeMae")}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="localNascimento">
                        Local de Nascimento
                      </Label>
                      <Input
                        id="localNascimento"
                        placeholder="Ex: Parnamirim/RN"
                        {...form1.register("localNascimento")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipoSanguineo">
                        Tipo Sanguíneo
                      </Label>
                      <Select
                        value={form1.watch("tipoSanguineo") || ""}
                        onValueChange={(val) =>
                          form1.setValue("tipoSanguineo", val)
                        }
                      >
                        <SelectTrigger id="tipoSanguineo">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ].map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <UploadDropzone
                    label="Upload CPF do PCD"
                    required
                    onFile={() => {}}
                    onUploadComplete={(url) => setUploadedUrls((prev) => ({ ...prev, cpfDoc: url }))}
                  />
                  <UploadDropzone
                    label="Upload RG ou Certidão de Nascimento"
                    required
                    onFile={() => {}}
                    onUploadComplete={(url) => setUploadedUrls((prev) => ({ ...prev, rgDoc: url }))}
                  />
                  <UploadDropzone
                    label="Laudo Médico com CID"
                    required
                    onFile={() => {}}
                    onUploadComplete={(url) => setUploadedUrls((prev) => ({ ...prev, laudo: url }))}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cid">
                        CID <span className="text-autism-red">*</span>
                      </Label>
                      <Input
                        id="cid"
                        placeholder="Ex: F84.0"
                        {...form2.register("cid")}
                      />
                      {form2.formState.errors.cid && (
                        <p className="text-xs text-autism-red">
                          {form2.formState.errors.cid.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crmMedico">
                        CRM do Médico{" "}
                        <span className="text-autism-red">*</span>
                      </Label>
                      <Input
                        id="crmMedico"
                        placeholder="CRM/UF 00000"
                        {...form2.register("crmMedico")}
                      />
                      {form2.formState.errors.crmMedico && (
                        <p className="text-xs text-autism-red">
                          {form2.formState.errors.crmMedico.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="rua">
                        Rua <span className="text-autism-red">*</span>
                      </Label>
                      <Input
                        id="rua"
                        placeholder="Nome da rua"
                        {...form3.register("rua")}
                      />
                      {form3.formState.errors.rua && (
                        <p className="text-xs text-autism-red">
                          {form3.formState.errors.rua.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">
                        Número <span className="text-autism-red">*</span>
                      </Label>
                      <Input
                        id="numero"
                        placeholder="Nº"
                        {...form3.register("numero")}
                      />
                      {form3.formState.errors.numero && (
                        <p className="text-xs text-autism-red">
                          {form3.formState.errors.numero.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        placeholder="Apto, bloco, etc."
                        {...form3.register("complemento")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro">
                        Bairro <span className="text-autism-red">*</span>
                      </Label>
                      <Input
                        id="bairro"
                        placeholder="Bairro"
                        {...form3.register("bairro")}
                      />
                      {form3.formState.errors.bairro && (
                        <p className="text-xs text-autism-red">
                          {form3.formState.errors.bairro.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cep">
                        CEP <span className="text-autism-red">*</span>
                      </Label>
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        value={form3.watch("cep")}
                        onChange={(e) =>
                          form3.setValue("cep", formatCEP(e.target.value), {
                            shouldValidate: true,
                          })
                        }
                      />
                      {form3.formState.errors.cep && (
                        <p className="text-xs text-autism-red">
                          {form3.formState.errors.cep.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value="Parnamirim"
                        disabled
                        {...form3.register("cidade")}
                      />
                    </div>
                  </div>

                  <UploadDropzone
                    label="Comprovante de Residência"
                    required
                    onFile={() => {}}
                    onUploadComplete={(url) => setUploadedUrls((prev) => ({ ...prev, comprovante: url }))}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="telefone">
                      Número de Contato{" "}
                      <span className="text-autism-red">*</span>
                    </Label>
                    <Input
                      id="telefone"
                      placeholder="(84) 99999-0000"
                      value={form3.watch("telefone")}
                      onChange={(e) =>
                        form3.setValue(
                          "telefone",
                          formatPhone(e.target.value),
                          { shouldValidate: true },
                        )
                      }
                    />
                    {form3.formState.errors.telefone && (
                      <p className="text-xs text-autism-red">
                        {form3.formState.errors.telefone.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={step === 1}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>

              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="gap-1 puzzle-gradient font-semibold"
                >
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2 bg-autism-green font-semibold text-white hover:bg-autism-green/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Emitindo...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Emitir Carteira
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Right Column - Live Preview */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <LiveCardPreview
                nomeCompleto={form1.watch("nomeCompleto")}
                cpf={form1.watch("cpf")}
                cid={form2.watch("cid")}
                fotoUrl={fotoPreview}
                dataNascimento={form1.watch("dataNascimento")}
                nomeMae={form1.watch("nomeMae") || ""}
                localNascimento={form1.watch("localNascimento") || ""}
                tipoSanguineo={form1.watch("tipoSanguineo") || ""}
                nomeAcompanhante={form1.watch("nomeAcompanhante") || ""}
                crmMedico={form2.watch("crmMedico") || ""}
                endereco={
                  form3.watch("rua")
                    ? `${form3.watch("rua")}, ${form3.watch("numero")}${form3.watch("complemento") ? ` - ${form3.watch("complemento")}` : ""}, ${form3.watch("bairro")} - Parnamirim/RN`
                    : ""
                }
              />
            </div>
          </div>
        </div>

        {/* Mobile Preview - shown below form on small screens */}
        <div className="mt-8 lg:hidden">
          <LiveCardPreview
            nomeCompleto={form1.watch("nomeCompleto")}
            cpf={form1.watch("cpf")}
            cid={form2.watch("cid")}
            fotoUrl={fotoPreview}
            dataNascimento={form1.watch("dataNascimento")}
            nomeMae={form1.watch("nomeMae") || ""}
            localNascimento={form1.watch("localNascimento") || ""}
            tipoSanguineo={form1.watch("tipoSanguineo") || ""}
            nomeAcompanhante={form1.watch("nomeAcompanhante") || ""}
            crmMedico={form2.watch("crmMedico") || ""}
            endereco={
              form3.watch("rua")
                ? `${form3.watch("rua")}, ${form3.watch("numero")}${form3.watch("complemento") ? ` - ${form3.watch("complemento")}` : ""}, ${form3.watch("bairro")} - Parnamirim/RN`
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
}

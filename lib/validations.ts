import { z } from "zod";
import { validateCPF } from "./utils";

export const step1Schema = z.object({
  nomeAcompanhante: z.string().optional(),
  nomeCompleto: z
    .string()
    .min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  cpf: z
    .string()
    .min(14, "CPF inválido")
    .refine((val) => validateCPF(val), { message: "CPF inválido" }),
  dataNascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine(
      (val) => {
        const date = new Date(val);
        return date < new Date() && date > new Date("1900-01-01");
      },
      { message: "Data de nascimento inválida" },
    ),
  nomeMae: z.string().optional(),
  localNascimento: z.string().optional(),
  tipoSanguineo: z.string().optional(),
});

export const step2Schema = z.object({
  cid: z
    .string()
    .min(1, "CID é obrigatório")
    .regex(/^[A-Za-z]\d{2}(\.\d)?$/, "Formato CID inválido (ex: F84.0)"),
  crmMedico: z.string().min(1, "CRM do médico é obrigatório"),
});

export const step3Schema = z.object({
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cep: z
    .string()
    .min(9, "CEP inválido")
    .regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  cidade: z.string().default("Parnamirim"),
  telefone: z
    .string()
    .min(14, "Telefone inválido"),
});

export const fullFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type FullFormData = z.infer<typeof fullFormSchema>;

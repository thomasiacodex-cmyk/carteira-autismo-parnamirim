import { describe, it, expect } from "vitest";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  fullFormSchema,
} from "@/lib/validations";

describe("step1Schema", () => {
  it("validates correct data", () => {
    const result = step1Schema.safeParse({
      nomeCompleto: "Maria da Silva",
      cpf: "529.982.247-25",
      dataNascimento: "2000-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short names", () => {
    const result = step1Schema.safeParse({
      nomeCompleto: "Ma",
      cpf: "529.982.247-25",
      dataNascimento: "2000-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid CPFs", () => {
    const result = step1Schema.safeParse({
      nomeCompleto: "Maria da Silva",
      cpf: "111.111.111-11",
      dataNascimento: "2000-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects future birth dates", () => {
    const result = step1Schema.safeParse({
      nomeCompleto: "Maria da Silva",
      cpf: "529.982.247-25",
      dataNascimento: "2099-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional fields", () => {
    const result = step1Schema.safeParse({
      nomeCompleto: "Maria da Silva",
      cpf: "529.982.247-25",
      dataNascimento: "2000-01-01",
      nomeMae: "Ana Silva",
      tipoSanguineo: "O+",
      localNascimento: "Natal/RN",
      nomeAcompanhante: "João Silva",
    });
    expect(result.success).toBe(true);
  });
});

describe("step2Schema", () => {
  it("validates correct CID format", () => {
    expect(step2Schema.safeParse({ cid: "F84.0", crmMedico: "CRM/RN 12345" }).success).toBe(true);
    expect(step2Schema.safeParse({ cid: "F84", crmMedico: "CRM 12345" }).success).toBe(true);
  });

  it("rejects invalid CID format", () => {
    expect(step2Schema.safeParse({ cid: "84.0", crmMedico: "CRM 12345" }).success).toBe(false);
    expect(step2Schema.safeParse({ cid: "F840.0", crmMedico: "CRM 12345" }).success).toBe(false);
    expect(step2Schema.safeParse({ cid: "", crmMedico: "CRM 12345" }).success).toBe(false);
  });
});

describe("step3Schema", () => {
  it("validates correct address data", () => {
    const result = step3Schema.safeParse({
      rua: "Rua das Flores",
      numero: "100",
      bairro: "Centro",
      cep: "59150-000",
      telefone: "(84) 99999-9999",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid CEP", () => {
    const result = step3Schema.safeParse({
      rua: "Rua das Flores",
      numero: "100",
      bairro: "Centro",
      cep: "59150",
      telefone: "(84) 99999-9999",
    });
    expect(result.success).toBe(false);
  });
});

describe("fullFormSchema", () => {
  it("validates a complete form", () => {
    const result = fullFormSchema.safeParse({
      nomeCompleto: "Maria da Silva",
      cpf: "529.982.247-25",
      dataNascimento: "2000-01-01",
      cid: "F84.0",
      crmMedico: "CRM/RN 12345",
      rua: "Rua das Flores",
      numero: "100",
      bairro: "Centro",
      cep: "59150-000",
      telefone: "(84) 99999-9999",
    });
    expect(result.success).toBe(true);
  });
});

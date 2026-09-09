import { describe, it, expect } from "vitest";
import { validateCPF, formatCPF, formatPhone, formatCEP, generateId } from "@/lib/utils";

describe("validateCPF", () => {
  it("returns true for valid CPFs", () => {
    expect(validateCPF("529.982.247-25")).toBe(true);
    expect(validateCPF("52998224725")).toBe(true);
  });

  it("returns false for invalid CPFs", () => {
    expect(validateCPF("123.456.789-00")).toBe(false);
    expect(validateCPF("111.111.111-11")).toBe(false);
    expect(validateCPF("000.000.000-00")).toBe(false);
    expect(validateCPF("12345")).toBe(false);
    expect(validateCPF("")).toBe(false);
  });

  it("returns false for all same digits", () => {
    for (let i = 0; i <= 9; i++) {
      expect(validateCPF(String(i).repeat(11))).toBe(false);
    }
  });
});

describe("formatCPF", () => {
  it("formats CPF correctly", () => {
    expect(formatCPF("52998224725")).toBe("529.982.247-25");
    expect(formatCPF("529")).toBe("529");
    expect(formatCPF("529982")).toBe("529.982");
    expect(formatCPF("529982247")).toBe("529.982.247");
  });

  it("handles non-numeric characters", () => {
    expect(formatCPF("abc")).toBe("");
    expect(formatCPF("529.982")).toBe("529.982");
  });
});

describe("formatPhone", () => {
  it("formats phone correctly", () => {
    expect(formatPhone("84999999999")).toBe("(84) 99999-9999");
    expect(formatPhone("84")).toBe("(84");
    expect(formatPhone("8499999")).toBe("(84) 99999");
  });
});

describe("formatCEP", () => {
  it("formats CEP correctly", () => {
    expect(formatCEP("59150000")).toBe("59150-000");
    expect(formatCEP("59150")).toBe("59150");
  });
});

describe("generateId", () => {
  it("generates 12-character alphanumeric IDs", () => {
    const id = generateId();
    expect(id).toHaveLength(12);
    expect(id).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

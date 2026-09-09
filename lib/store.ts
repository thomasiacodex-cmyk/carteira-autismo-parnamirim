import { create } from "zustand";

interface FormState {
  step: number;
  fotoPreview: string | null;
  formData: Record<string, string>;
  setStep: (step: number) => void;
  setFotoPreview: (url: string | null) => void;
  setFormData: (data: Record<string, string>) => void;
  reset: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  step: 1,
  fotoPreview: null,
  formData: {},
  setStep: (step) => set({ step }),
  setFotoPreview: (url) => set({ fotoPreview: url }),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  reset: () => set({ step: 1, fotoPreview: null, formData: {} }),
}));

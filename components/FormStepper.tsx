"use client";

import { cn } from "@/lib/utils";
import { Check, User, FileText, MapPin } from "lucide-react";

const steps = [
  { label: "Dados Pessoais", icon: User },
  { label: "Documentos", icon: FileText },
  { label: "Endereço e Contato", icon: MapPin },
];

export function FormStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8" role="navigation" aria-label="Etapas do formulário">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          const Icon = step.icon;

          return (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                    isCompleted &&
                      "border-autism-green bg-autism-green text-white",
                    isCurrent &&
                      "border-autism-blue bg-autism-blue text-white shadow-lg shadow-autism-blue/30",
                    !isCompleted &&
                      !isCurrent &&
                      "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${step.label}${isCompleted ? " (completo)" : isCurrent ? " (atual)" : ""}`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isCurrent
                      ? "text-autism-blue"
                      : isCompleted
                        ? "text-autism-green"
                        : "text-gray-400",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 rounded-full transition-all duration-500",
                    currentStep > stepNumber + 1
                      ? "bg-autism-green"
                      : currentStep > stepNumber
                        ? "bg-autism-blue"
                        : "bg-gray-200 dark:bg-gray-700",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

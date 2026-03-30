"use client";
import { useState, useRef } from "react";
import { Check, AlertCircle } from "lucide-react";
import type { ConsultationFormField } from "@/types/database";

interface ConsultationFormProps {
  fields: ConsultationFormField[];
  onSubmit: (data: Record<string, unknown>) => void;
  title?: string;
  description?: string;
}

export default function ConsultationForm({ fields, onSubmit, title, description }: ConsultationFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const updateField = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  // Signature pad handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.strokeStyle = "var(--foreground)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (fieldId: string) => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      updateField(fieldId, canvas.toDataURL());
    }
  };

  const clearSignature = (fieldId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateField(fieldId, null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      onSubmit(formData);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Form Submitted</h3>
        <p className="text-sm text-text-muted">Your consultation form has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {title && <h3 className="text-lg font-bold text-foreground">{title}</h3>}
      {description && <p className="text-sm text-text-muted mb-4">{description}</p>}

      {fields.map((field) => (
        <div key={field.id}>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === "text" && (
            <input
              type="text"
              placeholder={field.placeholder ?? ""}
              value={(formData[field.id] as string) ?? ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              placeholder={field.placeholder ?? ""}
              rows={3}
              value={(formData[field.id] as string) ?? ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition resize-none"
            />
          )}

          {field.type === "date" && (
            <input
              type="date"
              value={(formData[field.id] as string) ?? ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition"
            />
          )}

          {field.type === "checkbox" && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData[field.id] as boolean) ?? false}
                onChange={(e) => updateField(field.id, e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-text-muted">{field.placeholder ?? "Yes"}</span>
            </label>
          )}

          {field.type === "radio" && field.options && (
            <div className="space-y-2">
              {field.options.map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={field.id}
                    checked={formData[field.id] === opt}
                    onChange={() => updateField(field.id, opt)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === "select" && field.options && (
            <select
              value={(formData[field.id] as string) ?? ""}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition"
            >
              <option value="">Select...</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {field.type === "signature" && (
            <div>
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full border border-border rounded-xl bg-surface cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={() => stopDrawing(field.id)}
                onMouseLeave={() => stopDrawing(field.id)}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={() => stopDrawing(field.id)}
              />
              <button
                type="button"
                onClick={() => clearSignature(field.id)}
                className="mt-1 text-xs text-primary hover:underline"
              >
                Clear signature
              </button>
            </div>
          )}

          {errors[field.id] && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors[field.id]}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition mt-4"
      >
        Submit Form
      </button>
    </form>
  );
}

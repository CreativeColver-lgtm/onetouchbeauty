"use client";
import { useState } from "react";
import {
  Shield, Clock, CreditCard, AlertTriangle, Save,
  ToggleLeft, ToggleRight, Eye,
} from "lucide-react";
import CancellationPolicyComponent from "@/components/CancellationPolicy";

interface PolicyConfig {
  noticeHours: number;
  feePercentage: number;
  depositRequired: boolean;
  depositType: "percentage" | "fixed";
  depositPercentage: number;
  depositAmountPence: number;
  cardOnFile: boolean;
  freeCancellationHours: number;
  customText: string;
}

const NOTICE_OPTIONS = [2, 4, 6, 12, 24, 48, 72];

export default function CancellationPolicyPage() {
  const [config, setConfig] = useState<PolicyConfig>({
    noticeHours: 24,
    feePercentage: 50,
    depositRequired: true,
    depositType: "percentage",
    depositPercentage: 20,
    depositAmountPence: 2000,
    cardOnFile: false,
    freeCancellationHours: 48,
    customText: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Generate live preview text
  const generatePolicyText = () => {
    const lines = [
      `Cancellations made more than ${config.freeCancellationHours} hours before the appointment are free of charge.`,
      `Cancellations within ${config.noticeHours} hours of the appointment will incur a ${config.feePercentage}% cancellation fee.`,
    ];

    if (config.depositRequired) {
      if (config.depositType === "percentage") {
        lines.push(`A ${config.depositPercentage}% deposit is required at the time of booking. This will be deducted from the total service cost.`);
      } else {
        lines.push(`A £${(config.depositAmountPence / 100).toFixed(2)} deposit is required at the time of booking. This will be deducted from the total service cost.`);
      }
    }

    if (config.cardOnFile) {
      lines.push("A valid payment card must be kept on file to secure your booking.");
    }

    lines.push("No-shows without prior notice may be charged the full service amount.");
    lines.push("Rescheduling is free when done with sufficient notice.");

    return lines.join("\n\n");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cancellation Policy</h1>
          <p className="text-text-muted text-sm">Configure your booking cancellation rules</p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-foreground font-semibold rounded-xl hover:border-primary/30 transition text-sm"
        >
          <Eye size={14} /> {showPreview ? "Hide Preview" : "Client Preview"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="space-y-6">
          {/* Notice Period */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-primary" />
              <h3 className="font-bold text-foreground">Notice Period</h3>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted mb-2 block">
                Minimum notice for cancellation
              </label>
              <select
                value={config.noticeHours}
                onChange={(e) => setConfig({ ...config, noticeHours: parseInt(e.target.value) })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {NOTICE_OPTIONS.map((h) => (
                  <option key={h} value={h}>{h} hours</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-text-muted mb-2 block">
                Free cancellation window (hours)
              </label>
              <select
                value={config.freeCancellationHours}
                onChange={(e) => setConfig({ ...config, freeCancellationHours: parseInt(e.target.value) })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {[24, 48, 72, 96, 168].map((h) => (
                  <option key={h} value={h}>{h} hours ({Math.round(h / 24)} day{h > 24 ? "s" : ""})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cancellation Fee */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-amber-500" />
              <h3 className="font-bold text-foreground">Cancellation Fee</h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-text-muted">Fee percentage</label>
                <span className="text-sm font-bold text-primary">{config.feePercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={config.feePercentage}
                onChange={(e) => setConfig({ ...config, feePercentage: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-text-muted mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Deposit */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                <h3 className="font-bold text-foreground">Deposit Requirement</h3>
              </div>
              <button onClick={() => setConfig({ ...config, depositRequired: !config.depositRequired })}>
                {config.depositRequired
                  ? <ToggleRight size={24} className="text-accent" />
                  : <ToggleLeft size={24} className="text-text-muted" />
                }
              </button>
            </div>

            {config.depositRequired && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(["percentage", "fixed"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setConfig({ ...config, depositType: t })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                        config.depositType === t ? "bg-primary text-white" : "bg-surface border border-border text-text-muted"
                      }`}
                    >
                      {t === "percentage" ? "Percentage" : "Fixed Amount"}
                    </button>
                  ))}
                </div>

                {config.depositType === "percentage" ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-text-muted">Deposit percentage</label>
                      <span className="text-sm font-bold text-primary">{config.depositPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={config.depositPercentage}
                      onChange={(e) => setConfig({ ...config, depositPercentage: parseInt(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-text-muted mb-1 block">Fixed deposit amount (£)</label>
                    <input
                      type="number"
                      step="0.50"
                      min="1"
                      value={(config.depositAmountPence / 100).toFixed(2)}
                      onChange={(e) => setConfig({ ...config, depositAmountPence: Math.round(parseFloat(e.target.value || "0") * 100) })}
                      className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card on File */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-secondary" />
                <div>
                  <h3 className="font-bold text-foreground">Card on File</h3>
                  <p className="text-xs text-text-muted">Require clients to save a payment card</p>
                </div>
              </div>
              <button onClick={() => setConfig({ ...config, cardOnFile: !config.cardOnFile })}>
                {config.cardOnFile
                  ? <ToggleRight size={24} className="text-accent" />
                  : <ToggleLeft size={24} className="text-text-muted" />
                }
              </button>
            </div>
          </div>

          {/* Custom Text */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <label className="text-xs font-semibold text-text-muted mb-2 block">Custom Policy Text (optional)</label>
            <textarea
              value={config.customText}
              onChange={(e) => setConfig({ ...config, customText: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary resize-none"
              placeholder="Add any additional policy text..."
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition flex items-center justify-center gap-2"
          >
            <Save size={16} /> {saved ? "Policy Saved ✓" : "Save Cancellation Policy"}
          </button>
        </div>

        {/* Preview */}
        <div className={`${showPreview ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-20">
            <h3 className="text-sm font-bold text-text-muted mb-3">Client-facing Preview</h3>
            <CancellationPolicyComponent
              noticeHours={config.noticeHours}
              feePercentage={config.feePercentage}
              depositRequired={config.depositRequired}
              depositPercentage={config.depositPercentage}
              cardOnFileRequired={config.cardOnFile}
              customText={config.customText || null}
            />

            {/* Raw text preview */}
            <div className="mt-4 bg-surface-elevated border border-border rounded-2xl p-5">
              <h4 className="text-xs font-semibold text-text-muted mb-2">Policy Text (as shown in emails/confirmations)</h4>
              <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                {generatePolicyText()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

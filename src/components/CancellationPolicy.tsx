"use client";
import { Shield, Clock, CreditCard, AlertTriangle } from "lucide-react";

interface CancellationPolicyProps {
  noticeHours?: number;
  feePercentage?: number;
  depositRequired?: boolean;
  depositPercentage?: number;
  cardOnFileRequired?: boolean;
  customText?: string | null;
  compact?: boolean;
  freeCancel?: boolean | number;
  noShowCharge?: string | number | boolean;
}

export default function CancellationPolicy({
  noticeHours = 24,
  feePercentage = 50,
  depositRequired = false,
  depositPercentage = 20,
  cardOnFileRequired = false,
  customText,
  compact = false,
}: CancellationPolicyProps) {
  if (compact) {
    return (
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Cancellation Policy</h4>
            <ul className="text-xs text-text-muted space-y-1">
              <li>• Free cancellation up to {noticeHours} hours before your appointment</li>
              <li>• Late cancellations: {feePercentage}% fee applies</li>
              {depositRequired && <li>• A {depositPercentage}% deposit is required to book</li>}
              <li>• No-shows may be charged the full amount</li>
              <li>• Rescheduling is free with {noticeHours}+ hours notice</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-elevated border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={20} className="text-primary" />
        <h3 className="font-bold text-foreground">Cancellation Policy</h3>
      </div>

      {customText && (
        <p className="text-sm text-text-muted mb-4 leading-relaxed">{customText}</p>
      )}

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-surface rounded-xl">
          <Clock size={16} className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Free cancellation</p>
            <p className="text-xs text-text-muted">
              Cancel or reschedule up to {noticeHours} hours before your appointment at no charge.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-surface rounded-xl">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Late cancellations</p>
            <p className="text-xs text-text-muted">
              Cancellations within {noticeHours} hours of your appointment will incur a {feePercentage}% cancellation fee.
            </p>
          </div>
        </div>

        {depositRequired && (
          <div className="flex items-start gap-3 p-3 bg-surface rounded-xl">
            <CreditCard size={16} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Deposit required</p>
              <p className="text-xs text-text-muted">
                A {depositPercentage}% deposit is required to secure your booking. This will be deducted from the total.
              </p>
            </div>
          </div>
        )}

        {cardOnFileRequired && (
          <div className="flex items-start gap-3 p-3 bg-surface rounded-xl">
            <CreditCard size={16} className="text-secondary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Card on file</p>
              <p className="text-xs text-text-muted">
                A valid payment card is required to hold your booking.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/30">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">No-shows</p>
            <p className="text-xs text-text-muted">
              Failure to attend without notice may result in the full service amount being charged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

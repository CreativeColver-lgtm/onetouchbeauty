"use client";
import { useState } from "react";
import { CreditCard, Lock, Loader2, AlertTriangle, Check } from "lucide-react";

interface PaymentButtonProps {
  amount: number; // in pounds
  depositOnly?: boolean;
  serviceName?: string;
  salonId?: string;
  serviceIds?: number[];
  date?: string;
  time?: string;
  clientEmail?: string;
  onPaymentStart?: () => void;
  onPaymentError?: (error: string) => void;
}

export default function PaymentButton({
  amount,
  depositOnly = false,
  serviceName = "Beauty Services",
  salonId = "glow-studio",
  serviceIds = [1],
  date = "",
  time = "",
  clientEmail = "",
  onPaymentStart,
  onPaymentError,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositAmount = Math.max(10, Math.round(amount * 0.2));
  const paymentAmount = depositOnly ? depositAmount : amount;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    onPaymentStart?.();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceIds,
          salonId,
          date,
          time,
          clientEmail: clientEmail || "customer@example.com",
          amount: paymentAmount * 100, // convert to pence
          depositOnly,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503) {
          setError("Payment processing is not yet configured. Your booking has been saved — pay on arrival.");
          return;
        }
        throw new Error(data.error || "Payment failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      onPaymentError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Price Breakdown */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">{serviceName}</span>
          <span className="text-foreground font-medium">£{amount.toFixed(2)}</span>
        </div>
        {depositOnly && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Deposit (20%)</span>
              <span className="text-foreground font-medium">£{depositAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-text-muted pt-1 border-t border-border">
              <span>Remaining (pay at salon)</span>
              <span>£{(amount - depositAmount).toFixed(2)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between pt-2 border-t border-border font-bold">
          <span className="text-foreground">{depositOnly ? "Pay now" : "Total"}</span>
          <span className="text-primary text-lg">£{paymentAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">{error}</p>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Redirecting to payment...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Pay £{paymentAmount.toFixed(2)} {depositOnly ? "(Deposit)" : "& Confirm"}
          </>
        )}
      </button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
        <Lock size={11} />
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  );
}

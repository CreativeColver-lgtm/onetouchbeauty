"use client";
import { useState } from "react";
import { CreditCard, Lock, Loader2, AlertCircle, Check } from "lucide-react";

interface PaymentButtonProps {
  totalPrice: number;
  depositOnly: boolean;
  services: { name: string; price: number }[];
  salonId: string;
  date: string;
  time: string;
  clientEmail: string;
  onPaymentStart?: () => void;
}

export default function PaymentButton({
  totalPrice,
  depositOnly,
  services,
  salonId,
  date,
  time,
  clientEmail,
  onPaymentStart,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositAmount = Math.max(10, Math.round(totalPrice * 0.2));
  const payAmount = depositOnly ? depositAmount : totalPrice;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    onPaymentStart?.();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceIds: services.map((_, i) => i),
          salonId,
          date,
          time,
          clientEmail,
          amount: payAmount * 100, // Convert to pence
          depositOnly,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503) {
          setError(data.message || "Payment processing is not available yet.");
        } else {
          setError(data.error || "Something went wrong.");
        }
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Unable to connect to payment service. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Price Breakdown */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
        {services.map((s, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-foreground">{s.name}</span>
            <span className="text-text-muted">£{s.price}</span>
          </div>
        ))}
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Subtotal</span>
            <span className="text-foreground">£{totalPrice}</span>
          </div>
          {depositOnly && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-text-muted">Deposit (20%)</span>
              <span className="text-foreground font-semibold">£{depositAmount}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between pt-2 border-t border-border font-bold text-lg">
          <span className="text-foreground">{depositOnly ? "Due now" : "Total"}</span>
          <span className="text-primary">£{payAmount}</span>
        </div>
        {depositOnly && (
          <p className="text-xs text-text-muted">
            Remaining £{totalPrice - depositAmount} due at the salon
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Lock size={12} />
        <span>Payments secured with 256-bit SSL encryption</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            <p className="text-red-500 dark:text-red-500 text-xs mt-1">
              You can still confirm your booking — pay at the salon instead.
            </p>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Redirecting to payment...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Pay £{payAmount} & Confirm
          </>
        )}
      </button>

      {/* Accepted Cards */}
      <div className="flex items-center justify-center gap-3 text-text-muted/60">
        <span className="text-xs">Visa</span>
        <span className="text-xs">Mastercard</span>
        <span className="text-xs">Amex</span>
        <span className="text-xs">Apple Pay</span>
      </div>
    </div>
  );
}

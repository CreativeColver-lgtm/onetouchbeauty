"use client";
import { useState } from "react";
import { Share2, Copy, Check, MessageCircle, X as XIcon } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  compact?: boolean;
}

export default function ShareButton({ url, title, text = "", compact = false }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = url.startsWith("http") ? url : `${typeof window !== "undefined" ? window.location.origin : ""}${url}`;
  const encoded = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text || title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: fullUrl });
      } catch {
        setShowMenu(true);
      }
    } else {
      setShowMenu(true);
    }
  };

  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedText}%20${encoded}`, icon: <MessageCircle size={16} />, color: "text-green-500" },
    { label: "Twitter / X", href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encoded}`, icon: <XIcon size={16} />, color: "text-foreground" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, icon: <Share2 size={16} />, color: "text-blue-500" },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encoded}`, icon: <Share2 size={16} />, color: "text-primary" },
  ];

  if (compact) {
    return (
      <button
        onClick={shareNative}
        className="px-4 py-2.5 border border-border text-foreground rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center"
      >
        <Share2 size={14} />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={shareNative}
        className="flex items-center gap-2 px-4 py-2.5 border border-border text-foreground font-semibold rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition text-sm"
      >
        <Share2 size={14} /> Share
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute top-full mt-2 right-0 w-52 bg-surface-elevated border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-slide-down">
            <button
              onClick={() => { copyLink(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface transition"
            >
              {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} className="text-text-muted" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface transition"
                onClick={() => setShowMenu(false)}
              >
                <span className={link.color}>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

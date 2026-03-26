"use client";
import { useState } from "react";
import {
  QrCode, Download, Printer, Palette, Check,
  Smartphone, Star, Clock, Shield, ChevronRight,
} from "lucide-react";

const colorOptions = [
  { name: "Pink", value: "#f78da7", ring: "ring-pink-400" },
  { name: "Black", value: "#1a1a2e", ring: "ring-gray-800" },
  { name: "Blue", value: "#0693e3", ring: "ring-blue-500" },
  { name: "Green", value: "#00d084", ring: "ring-green-500" },
  { name: "Purple", value: "#7c3aed", ring: "ring-purple-500" },
];

const instructions = [
  { step: 1, title: "Print the QR code", desc: "Download and print the QR code on a card or poster." },
  { step: 2, title: "Display in your salon", desc: "Place it at reception, mirrors, or waiting areas." },
  { step: 3, title: "Clients scan to check in", desc: "Clients scan with their phone camera — no app needed." },
  { step: 4, title: "Collect reviews automatically", desc: "After their visit, clients get prompted to leave a review." },
];

export default function QRCheckInPage() {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [showLogo, setShowLogo] = useState(true);

  // Generate SVG QR-like pattern
  const qrSize = 21;
  const cells: boolean[][] = [];
  for (let r = 0; r < qrSize; r++) {
    cells[r] = [];
    for (let c = 0; c < qrSize; c++) {
      // Position detection patterns (corners)
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= qrSize - 7;
      const isBottomLeft = r >= qrSize - 7 && c < 7;

      if (isTopLeft || isTopRight || isBottomLeft) {
        // Border of finder pattern
        const lr = isTopLeft ? r : isBottomLeft ? r - (qrSize - 7) : r;
        const lc = isTopLeft ? c : isTopRight ? c - (qrSize - 7) : c;
        cells[r][c] = lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
      } else {
        // Random-ish data pattern
        cells[r][c] = ((r * 7 + c * 13 + r * c) % 3) !== 0;
      }
    }
  }

  const cellSize = 12;
  const padding = 24;
  const svgSize = qrSize * cellSize + padding * 2;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">QR Code Check-In</h1>
          <p className="text-text-muted">Let clients check in and leave reviews with a scan</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Display */}
          <div className="space-y-6">
            <div className="bg-surface-elevated border border-border rounded-2xl p-8 text-center">
              {/* QR Code SVG */}
              <div className="inline-block bg-white rounded-2xl p-4 shadow-lg">
                <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                  <rect width={svgSize} height={svgSize} fill="white" rx="8" />
                  {cells.map((row, r) =>
                    row.map((filled, c) =>
                      filled ? (
                        <rect
                          key={`${r}-${c}`}
                          x={padding + c * cellSize}
                          y={padding + r * cellSize}
                          width={cellSize}
                          height={cellSize}
                          fill={selectedColor.value}
                          rx={1.5}
                        />
                      ) : null
                    )
                  )}
                  {/* Center logo placeholder */}
                  {showLogo && (
                    <>
                      <rect
                        x={svgSize / 2 - 24}
                        y={svgSize / 2 - 24}
                        width={48}
                        height={48}
                        fill="white"
                        rx={8}
                      />
                      <text
                        x={svgSize / 2}
                        y={svgSize / 2 + 6}
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="bold"
                        fill={selectedColor.value}
                      >
                        OT
                      </text>
                    </>
                  )}
                </svg>
              </div>

              <p className="text-sm text-text-muted mt-4">onetouchbeauty.co.uk/checkin/glow-studio</p>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
                  <Download size={16} /> Download
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-elevated border border-border text-foreground font-semibold rounded-xl text-sm hover:border-primary/30 transition">
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <QrCode size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Print this QR code and display in your salon</p>
                  <p className="text-sm text-text-muted mt-1">Clients can scan to check in, view your services, and leave reviews — all without downloading an app.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customisation */}
          <div className="space-y-6">
            {/* Color Options */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Palette size={18} /> Customise
              </h3>

              <div className="mb-5">
                <label className="text-sm font-medium text-foreground mb-3 block">QR Code Colour</label>
                <div className="flex gap-3">
                  {colorOptions.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-10 h-10 rounded-full border-2 transition ${
                        selectedColor.name === c.name ? `ring-2 ${c.ring} ring-offset-2 border-transparent` : "border-border"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Show logo in centre</p>
                  <p className="text-xs text-text-muted">Display your brand mark in the QR code</p>
                </div>
                <button onClick={() => setShowLogo(!showLogo)} aria-label="Toggle logo">
                  {showLogo ? (
                    <div className="w-11 h-6 rounded-full bg-accent flex items-center justify-end px-0.5">
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  ) : (
                    <div className="w-11 h-6 rounded-full bg-border flex items-center px-0.5">
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">How It Works</h3>
              <div className="space-y-4">
                {instructions.map((inst) => (
                  <div key={inst.step} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {inst.step}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{inst.title}</p>
                      <p className="text-xs text-text-muted">{inst.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">Benefits</h3>
              <div className="space-y-3">
                {[
                  { icon: Smartphone, text: "No app download required — works with any phone camera" },
                  { icon: Star, text: "Automatically prompts clients to leave reviews" },
                  { icon: Clock, text: "Reduces wait times with instant check-in" },
                  { icon: Shield, text: "Secure and GDPR compliant" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <b.icon size={16} className="text-accent shrink-0" />
                    <p className="text-sm text-text-muted">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

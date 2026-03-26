"use client";

export default function SkeletonCard() {
  return (
    <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 skeleton" />
        <div className="h-4 w-1/2 skeleton" />
        <div className="h-3 w-1/3 skeleton" />
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="h-4 w-20 skeleton" />
          <div className="h-4 w-16 skeleton" />
        </div>
      </div>
    </div>
  );
}

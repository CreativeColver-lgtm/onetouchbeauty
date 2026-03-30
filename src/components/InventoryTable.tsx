"use client";
import { useState } from "react";
import Image from "next/image";
import { Search, AlertTriangle, Package, Edit2, Check, X } from "lucide-react";

interface ProductRow {
  id: string;
  name: string;
  brand: string | null;
  sku: string | null;
  category: string | null;
  image_url: string | null;
  price_pence: number;
  stock_quantity: number;
  low_stock_threshold: number;
}

interface InventoryTableProps {
  products: ProductRow[];
  onUpdateStock?: (productId: string, newQuantity: number) => void;
  onEdit?: (productId: string) => void;
}

export default function InventoryTable({ products, onUpdateStock, onEdit }: InventoryTableProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];

  const filtered = products.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const startEdit = (p: ProductRow) => {
    setEditingId(p.id);
    setEditQty(p.stock_quantity);
  };

  const saveEdit = (productId: string) => {
    onUpdateStock?.(productId, editQty);
    setEditingId(null);
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-surface border border-border rounded-xl">
          <Search size={16} className="text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-text-muted p-3">Product</th>
                <th className="text-left text-xs font-semibold text-text-muted p-3 hidden sm:table-cell">SKU</th>
                <th className="text-left text-xs font-semibold text-text-muted p-3 hidden md:table-cell">Category</th>
                <th className="text-right text-xs font-semibold text-text-muted p-3">Price</th>
                <th className="text-right text-xs font-semibold text-text-muted p-3">Stock</th>
                <th className="text-right text-xs font-semibold text-text-muted p-3 w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isLow = p.stock_quantity <= p.low_stock_threshold;
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                            <Image src={p.image_url} alt={p.name} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0">
                            <Package size={16} className="text-text-muted" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-foreground">{p.name}</p>
                          {p.brand && <p className="text-xs text-text-muted">{p.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className="text-xs text-text-muted font-mono">{p.sku ?? "—"}</span>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                        {p.category ?? "—"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-sm font-semibold text-foreground">
                        £{(p.price_pence / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {editingId === p.id ? (
                        <div className="flex items-center gap-1 justify-end">
                          <input
                            type="number"
                            min={0}
                            value={editQty}
                            onChange={(e) => setEditQty(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-surface border border-primary rounded text-sm text-foreground text-right focus:outline-none"
                          />
                          <button onClick={() => saveEdit(p.id)} className="p-1 text-accent hover:bg-accent/10 rounded">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-text-muted hover:bg-surface rounded">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(p)}
                          className={`text-sm font-semibold inline-flex items-center gap-1 ${
                            isLow ? "text-red-500" : "text-foreground"
                          }`}
                        >
                          {isLow && <AlertTriangle size={12} className="text-red-500" />}
                          {p.stock_quantity}
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onEdit?.(p.id)}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition"
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-text-muted">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

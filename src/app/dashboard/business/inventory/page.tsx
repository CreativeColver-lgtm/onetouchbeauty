"use client";
import { useState } from "react";
import {
  Plus, X, AlertTriangle, Package, Search, Upload,
} from "lucide-react";
import InventoryTable from "@/components/InventoryTable";

interface Product {
  id: string;
  name: string;
  brand: string | null;
  sku: string | null;
  category: string | null;
  image_url: string | null;
  cost_pence: number;
  price_pence: number;
  stock_quantity: number;
  low_stock_threshold: number;
  description: string | null;
  is_active: boolean;
}

const CATEGORIES = ["Hair Care", "Colour", "Styling", "Tools", "Skincare", "Accessories"];

const mockProducts: Product[] = [
  { id: "1", name: "Olaplex No.3 Hair Perfector", brand: "Olaplex", sku: "OLP-003", category: "Hair Care", image_url: null, cost_pence: 1200, price_pence: 2600, stock_quantity: 24, low_stock_threshold: 5, description: null, is_active: true },
  { id: "2", name: "L'Oréal Professionnel Serie Expert", brand: "L'Oréal", sku: "LOR-SE01", category: "Hair Care", image_url: null, cost_pence: 800, price_pence: 1800, stock_quantity: 3, low_stock_threshold: 5, description: null, is_active: true },
  { id: "3", name: "GHD Original Styler", brand: "GHD", sku: "GHD-OG1", category: "Tools", image_url: null, cost_pence: 8500, price_pence: 16900, stock_quantity: 6, low_stock_threshold: 2, description: null, is_active: true },
  { id: "4", name: "Schwarzkopf IGORA Royal", brand: "Schwarzkopf", sku: "SKP-IG01", category: "Colour", image_url: null, cost_pence: 450, price_pence: 0, stock_quantity: 18, low_stock_threshold: 10, description: "Professional salon colour", is_active: true },
  { id: "5", name: "Moroccanoil Treatment", brand: "Moroccanoil", sku: "MOR-TRT", category: "Hair Care", image_url: null, cost_pence: 1500, price_pence: 3200, stock_quantity: 2, low_stock_threshold: 5, description: null, is_active: true },
  { id: "6", name: "Dyson Supersonic Hair Dryer", brand: "Dyson", sku: "DYS-SS01", category: "Tools", image_url: null, cost_pence: 22000, price_pence: 32999, stock_quantity: 1, low_stock_threshold: 1, description: null, is_active: true },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");

  const [form, setForm] = useState({
    name: "", brand: "", sku: "", category: "", description: "",
    cost_pence: 0, price_pence: 0, stock_quantity: 0, low_stock_threshold: 5,
  });

  const lowStockProducts = products.filter((p) => p.is_active && p.stock_quantity <= p.low_stock_threshold);
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];

  const displayProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ name: "", brand: "", sku: "", category: "", description: "", cost_pence: 0, price_pence: 0, stock_quantity: 0, low_stock_threshold: 5 });
    setShowAddForm(true);
  };

  const openEdit = (productId: string) => {
    const p = products.find((pr) => pr.id === productId);
    if (!p) return;
    setEditingProduct(p);
    setForm({
      name: p.name, brand: p.brand || "", sku: p.sku || "",
      category: p.category || "", description: p.description || "",
      cost_pence: p.cost_pence, price_pence: p.price_pence,
      stock_quantity: p.stock_quantity, low_stock_threshold: p.low_stock_threshold,
    });
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? {
        ...p, ...form,
        brand: form.brand || null, sku: form.sku || null,
        category: form.category || null, description: form.description || null,
      } : p));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...form,
        brand: form.brand || null, sku: form.sku || null,
        category: form.category || null, description: form.description || null,
        image_url: null, is_active: true,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowAddForm(false);
  };

  const handleUpdateStock = (productId: string, newQty: number) => {
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, stock_quantity: newQty } : p));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-text-muted text-sm">{products.length} products · {lowStockProducts.length} low stock alerts</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Low stock alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Low Stock Alerts</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map((p) => (
              <span key={p.id} className="text-xs px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium">
                {p.name} — {p.stock_quantity} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto mb-6 pb-1">
        <button
          onClick={() => setActiveCategory("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            !activeCategory ? "bg-primary text-white" : "bg-surface border border-border text-text-muted hover:border-primary/30"
          }`}
        >
          All ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat ? "bg-primary text-white" : "bg-surface border border-border text-text-muted hover:border-primary/30"
            }`}
          >
            {cat} ({products.filter((p) => p.category === cat).length})
          </button>
        ))}
      </div>

      {/* Inventory table */}
      <InventoryTable
        products={displayProducts}
        onUpdateStock={handleUpdateStock}
        onEdit={openEdit}
      />

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <div className="relative bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl mb-8">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface rounded-lg transition"
            >
              <X size={18} className="text-text-muted" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-5">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Product Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="e.g. Olaplex No.3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Brand</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">SKU</label>
                  <input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary font-mono"
                    placeholder="SKU-001"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Cost (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={(form.cost_pence / 100).toFixed(2)}
                    onChange={(e) => setForm({ ...form, cost_pence: Math.round(parseFloat(e.target.value || "0") * 100) })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Retail Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={(form.price_pence / 100).toFixed(2)}
                    onChange={(e) => setForm({ ...form, price_pence: Math.round(parseFloat(e.target.value || "0") * 100) })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock_quantity}
                    onChange={(e) => setForm({ ...form, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Low Stock Alert</label>
                  <input
                    type="number"
                    min="0"
                    value={form.low_stock_threshold}
                    onChange={(e) => setForm({ ...form, low_stock_threshold: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary resize-none"
                  placeholder="Optional product description..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-4 border-t border-border">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 bg-surface border border-border text-foreground font-semibold rounded-xl hover:bg-surface/80 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim()}
                className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition disabled:opacity-40"
              >
                {editingProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

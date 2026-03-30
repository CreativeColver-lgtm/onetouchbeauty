// =============================================================================
// Inventory — Product management and stock tracking
// =============================================================================

import { createClient } from './supabase'
import type { InventoryProduct as Product, InventoryTransaction as StockTransaction, InventoryTransactionType as StockTransactionType } from '@/types/database'

interface ProductFilters {
  category?: string
  search?: string
  low_stock_only?: boolean
  is_active?: boolean
}

// ---------------------------------------------------------------------------
// Get products
// ---------------------------------------------------------------------------
export async function getProducts(
  businessId: string,
  filters: ProductFilters = {}
): Promise<Product[]> {
  const supabase = createClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .order('name', { ascending: true })

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`)
  }

  if (filters.low_stock_only) {
    // RPC or raw filter: stock_quantity <= low_stock_threshold
    query = query.filter('stock_quantity', 'lte', 'low_stock_threshold')
  }

  if (filters.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active)
  }

  const { data } = await query
  return (data ?? []) as Product[]
}

// ---------------------------------------------------------------------------
// Update stock
// ---------------------------------------------------------------------------
export async function updateStock(
  productId: string,
  quantity: number,
  type: StockTransactionType,
  notes?: string
): Promise<{ product: Product; transaction: StockTransaction } | null> {
  const supabase = createClient()

  // Get current product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (!product) return null

  // Calculate new stock
  let adjustment = quantity
  if (type === 'sale' || type === 'return') {
    adjustment = type === 'sale' ? -Math.abs(quantity) : Math.abs(quantity)
  }

  const newQuantity = Math.max(0, (product as Product).stock_quantity + adjustment)

  // Update product stock
  const { data: updated } = await supabase
    .from('products')
    .update({ stock_quantity: newQuantity })
    .eq('id', productId)
    .select()
    .single()

  // Record transaction
  const { data: txn } = await supabase
    .from('stock_transactions')
    .insert({
      product_id: productId,
      quantity: adjustment,
      type,
      notes: notes ?? null,
    })
    .select()
    .single()

  return {
    product: updated as Product,
    transaction: txn as StockTransaction,
  }
}

// ---------------------------------------------------------------------------
// Get low stock alerts
// ---------------------------------------------------------------------------
export async function getLowStockAlerts(businessId: string): Promise<Product[]> {
  const supabase = createClient()

  // Get products where stock is at or below threshold
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)

  // Filter client-side since Supabase can't compare two columns easily
  const products = (data ?? []) as Product[]
  return products.filter((p) => p.stock_quantity <= p.low_stock_threshold)
}

// ---------------------------------------------------------------------------
// Get stock transaction history
// ---------------------------------------------------------------------------
export async function getStockTransactions(
  productId: string,
  limit = 20
): Promise<StockTransaction[]> {
  const supabase = createClient()

  const { data } = await supabase
    .from('stock_transactions')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as StockTransaction[]
}

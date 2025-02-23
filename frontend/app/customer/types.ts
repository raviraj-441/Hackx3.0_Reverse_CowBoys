export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
}

export interface MenuItem {
  id: string; // Backend provides UUID instead of number
  name: string;
  description: string | null;
  category: string;
  sub_category?: string;
  tax_percentage: string;
  packaging_charge: string;
  SKU: string;
  variations: Record<string, number>; // Keeps price mapping as object
  created_at: string;
  image_url: string | null;
  preparation_time: number;
}


export interface RewardItem {
  id: number;
  name: string;
  pointsCost: number;
  description: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  variant?: string;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  total: number;
  points: number;
}

export interface ScratchCardType {
  id: string;
  type: string;
  value: number;
  description: string;
  category: string;
  minimumOrder: number;
  expiresIn: number;
}
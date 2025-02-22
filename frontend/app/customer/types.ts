export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  variants?: string[];
  points: number;
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

export interface ScratchCard {
  id: number;
  type: 'discount' | 'points' | 'freeItem';
  value: number;
  description: string;
  category?: string; // For category-specific discounts
  minimumOrder?: number;
  expiresIn: number; // Hours
}
//data.ts
import { MenuCategory, MenuItem, RewardItem, ScratchCard } from './types';

export const menuCategories: MenuCategory[] = [
  { id: 1, name: 'Today\'s Specials', slug: 'specials' },
  { id: 2, name: 'Main Course', slug: 'main' },
  { id: 3, name: 'Beverages', slug: 'beverages' },
  { id: 4, name: 'Desserts', slug: 'desserts' },
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Truffle Mushroom Pizza',
    description: 'Hand-tossed pizza with exotic mushrooms and truffle oil',
    price: 599,
    category: 'specials',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop',
    available: true,
    variants: ['Small', 'Medium', 'Large'],
    points: 50
  },
  {
    id: 2,
    name: 'Signature Cold Brew',
    description: 'House-special cold brew with vanilla notes',
    price: 249,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop',
    available: true,
    variants: ['Regular', 'Large'],
    points: 25
  },
  {
    id: 3,
    name: 'Molten Lava Cake',
    description: 'Warm chocolate cake with a gooey center',
    price: 299,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop',
    available: true,
    points: 30
  },
];

export const recommendations: Record<number, MenuItem[]> = {
  1: [
    {
      id: 2,
      name: 'Signature Cold Brew',
      description: 'Perfect pair with your pizza!',
      price: 199,
      category: 'beverages',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop',
      available: true,
      points: 25
    }
  ]
};

export const rewards: RewardItem[] = [
  {
    id: 1,
    name: 'Free Dessert',
    pointsCost: 200,
    description: 'Get any dessert for free!',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    name: '50% Off Beverages',
    pointsCost: 150,
    description: 'Half price on any beverage',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop'
  }
];

export const scratchCards: ScratchCard[] = [
  {
    id: 1,
    type: 'discount',
    value: 20, // 20% off
    description: '20% off on beverages',
    category: 'beverages',
    minimumOrder: 200,
    expiresIn: 24
  },
  {
    id: 2,
    type: 'points',
    value: 50,
    description: 'Extra 50 points on your next order',
    minimumOrder: 500,
    expiresIn: 48
  },
  {
    id: 3,
    type: 'freeItem',
    value: 1,
    description: 'Free dessert with your next order',
    category: 'desserts',
    minimumOrder: 800,
    expiresIn: 72
  }
];
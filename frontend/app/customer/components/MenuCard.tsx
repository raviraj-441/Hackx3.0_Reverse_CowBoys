// MenuCard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
// import { MenuItem } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// First, let's update the MenuItem interface to match backend response
interface MenuItem {
  id: string;
  name: string;
  category: string;
  sub_category: string;
  tax_percentage: string;
  packaging_charge: string;
  SKU: string;
  variations: {
    [key: string]: number;
  };
  created_at: string;
  description: string | null;
  image_url: string | null;
  preparation_time: number;
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, variant: string) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(Object.keys(item.variations)[0]);
  
  // Get the price for the selected variant
  const currentPrice = item.variations[selectedVariant];
  
  // Calculate total price including tax and packaging
  const totalPrice = currentPrice + 
    (currentPrice * parseFloat(item.tax_percentage) / 100) + 
    parseFloat(item.packaging_charge);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className="relative h-64 rounded-t-2xl overflow-hidden">
        <img
          src={item.image_url || '/placeholder-food.jpg'} // Add a default placeholder image
          alt={item.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
          <p className="text-sm text-gray-300 line-clamp-2">
            {item.description || `${item.sub_category} - Ready in ${item.preparation_time} mins`}
          </p>
        </div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl p-4 rounded-b-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">₹{currentPrice}</span>
            <span className="text-xs text-gray-400">
              +₹{item.packaging_charge} packaging
              {parseFloat(item.tax_percentage) > 0 && ` • ${item.tax_percentage}% tax`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-8 w-8 bg-gray-800 border-gray-700"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-white">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              className="h-8 w-8 bg-gray-800 border-gray-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {Object.keys(item.variations).length > 1 && (
          <Select
            value={selectedVariant}
            onValueChange={setSelectedVariant}
          >
            <SelectTrigger className="mb-4 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(item.variations).map(([variant, price]) => (
                <SelectItem key={variant} value={variant}>
                  {variant} - ₹{price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={() => onAddToCart(item, quantity, selectedVariant)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart (₹{(totalPrice * quantity).toFixed(2)})
        </Button>
      </div>
    </motion.div>
  );
}
// MenuCard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, variant?: string) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(item.variants?.[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className="relative h-64 rounded-t-2xl overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
          <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
        </div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl p-4 rounded-b-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-white">₹{item.price}</span>
            {/* <Badge variant="secondary" className="ml-2">+{item.points} pts</Badge> */}
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

        {item.variants && (
          <Select
            value={variant}
            onValueChange={setVariant}
          >
            <SelectTrigger className="mb-4 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {item.variants.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={() => onAddToCart(item, quantity, variant)}
          disabled={!item.available}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
//Cart.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem, OrderSummary } from '../types';

interface CartProps {
  items: CartItem[];
  summary: OrderSummary;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  onUpdateQuantity: (id: number, newQuantity: number) => void; // ✅ New prop
}


export function Cart({ items, summary, onRemoveItem, onCheckout, onUpdateQuantity }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate points based on total order value (1 point per ₹10 spent)
  const rewardPointsEarned = Math.floor(summary.total / 10);

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-purple-600 hover:bg-purple-700"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Cart ({items.length})
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-y-0 right-0 w-full md:w-96 bg-black/95 backdrop-blur-xl border-l border-purple-500/20 shadow-xl z-30"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-purple-500/20">
                <h2 className="text-xl font-semibold text-white">Your Order</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-white absolute top-4 right-4 z-[999]"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-7 w-7" />
                </Button>

              </div>

              <ScrollArea className="flex-1 p-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-purple-900/20"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-purple-400">{item.variant}</p>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-2 py-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-white bg-purple-600 hover:bg-purple-700 rounded-md text-base"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-white font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-white bg-purple-600 hover:bg-purple-700 rounded-md text-base"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="px-3 py-1 ml-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-md text-sm"
                        >
                          Remove
                        </button>
                        <p className="text-gray-400">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

              </ScrollArea>

              <div className="p-4 border-t border-purple-500/20">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{summary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-purple-400">
                    <span>Discount</span>
                    <span>-₹{summary.discount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Total</span>
                    <span>₹{summary.total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-purple-400">
                    <span>Points to earn</span>
                    <span>+{rewardPointsEarned}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={onCheckout}
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
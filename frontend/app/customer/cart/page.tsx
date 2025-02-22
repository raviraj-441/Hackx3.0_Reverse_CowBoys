// app/customer/cart/page.tsx
"use client";

import { useState } from "react";
import {Cart} from "../components/Cart";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Cappuccino", price: 150, quantity: 1 },
    { id: 2, name: "Cheese Croissant", price: 80, quantity: 2 },
  ]);

  const handleRemoveFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    alert("Order placed successfully!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">Your Cart</h1>
      <Cart items={cartItems} summary={{ total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) }} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />
    </div>
  );
}

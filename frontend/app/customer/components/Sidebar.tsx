// app/customer/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen bg-[#121212] text-white w-64 fixed top-0 left-0 shadow-lg md:relative md:block md:w-64">
      <button
        className="absolute top-4 right-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <nav className={`mt-16 p-4 space-y-4 ${isOpen ? "block" : "hidden md:block"}`}>
        <Link href="/customer/menu" className="block p-3 bg-gray-800 rounded-lg hover:bg-purple-600">
          Menu
        </Link>
        <Link href="/customer/rewards" className="block p-3 bg-gray-800 rounded-lg hover:bg-purple-600">
          Rewards
        </Link>
        <Link href="/customer/scratchcards" className="block p-3 bg-gray-800 rounded-lg hover:bg-purple-600">
          Scratch Cards
        </Link>
        <Link href="/customer/cart" className="block p-3 bg-gray-800 rounded-lg hover:bg-purple-600">
          Cart
        </Link>
      </nav>
    </div>
  );
}

// app/customer/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, ShoppingCart, List, Home } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/customer', icon: <Home className="w-5 h-5" /> },
    { name: 'Scratch Card', href: '/customer/scratchcards', icon: <Gift className="w-5 h-5" /> },
    { name: 'Orders', href: '/customer/orders', icon: <List className="w-5 h-5" /> },
    { name: 'Cart', href: '/customer/cart', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-gray-900 text-white py-3 px-6 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">Smart Café</h1>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === item.href ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

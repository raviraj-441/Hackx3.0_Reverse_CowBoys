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
    // { name: 'Cart', href: '/customer/cart', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/50 backdrop-blur-lg border border-gray-700/30 shadow-lg rounded-full px-6 py-3 z-50 flex gap-6 items-center">
      {navItems.map((item) => (
        <Link 
          key={item.name} 
          href={item.href} 
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
            pathname === item.href 
              ? 'bg-purple-600/70 text-white shadow-md' 
              : 'text-gray-300 hover:bg-gray-800/40 hover:text-white'
          }`}
        >
          {item.icon}
          <span className="hidden md:inline">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}

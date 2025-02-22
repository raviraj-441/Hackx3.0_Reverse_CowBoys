// app/customer/menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import {MenuCard} from "../components/MenuCard";
import { menuItems, menuCategories } from "../data";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MenuPage() {
  const [menu, setMenu] = useState(menuItems); // Load menu from dummy data
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let filteredMenu = menuItems;

    if (searchQuery) {
      filteredMenu = filteredMenu.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filteredMenu = filteredMenu.filter((item) => item.categoryId === parseInt(selectedCategory));
    }

    setMenu(filteredMenu);
  }, [searchQuery, selectedCategory]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">Menu</h1>

      {/* Search and Filter Bar */}
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 mb-6 shadow-xl border border-gray-800">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search our menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Items
            </button>
            {menuCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id.toString())}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category.id.toString()
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menu.length > 0 ? (
          menu.map((item) => <MenuCard key={item.id} item={item} />)
        ) : (
          <p className="text-gray-400 text-center">No items found.</p>
        )}
      </div>
    </div>
  );
}

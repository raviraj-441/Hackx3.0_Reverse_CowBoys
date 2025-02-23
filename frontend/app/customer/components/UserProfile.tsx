"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth");
  };

  return (
    <div className="fixed top-4 right-6 z-40">
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-full border border-gray-700 hover:bg-gray-800 transition-all"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white font-bold rounded-full">
            {user ? getInitials(user.name) : "?"}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-red-600 hover:text-white flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

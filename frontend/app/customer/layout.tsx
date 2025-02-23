"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import UserProfile from "./components/UserProfile";
import Navbar from "./components/Navbar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.replace("/auth"); // Redirect if no user
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated === null) return null; // Prevent flickering

  return (
    <div className="relative min-h-screen">
      {/* User Profile at the Top Right */}
      <div className="absolute top-4 right-4">
        <UserProfile />
      </div>

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main>{children}</main>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

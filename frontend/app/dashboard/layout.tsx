"use client";

import { Button } from "@/components/ui/button";
import {
  Coffee,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Menu", href: "/dashboard/menu", icon: Menu },
  { name: "Orders", href: "/dashboard/orders", icon: Package },
  { name: "Staff", href: "/dashboard/staff", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6">
          <div className="flex h-16 items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Coffee className="h-6 w-6" />
              <span className="text-lg font-semibold">Smart Café</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link href={item.href}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </Button>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="pl-72">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const orders = [
  {
    id: "#101",
    customer: "John Doe",
    items: ["Latte", "Croissant"],
    total: 8.99,
    status: "Pending",
    time: "2 mins ago",
  },
  {
    id: "#102",
    customer: "Sarah Smith",
    items: ["Burger", "Fries", "Coke"],
    total: 15.99,
    status: "Preparing",
    time: "5 mins ago",
  },
  {
    id: "#103",
    customer: "Mike Johnson",
    items: ["Pizza", "Garlic Bread"],
    total: 18.99,
    status: "Ready",
    time: "8 mins ago",
  },
  {
    id: "#104",
    customer: "Emily Brown",
    items: ["Caesar Salad", "Iced Tea"],
    total: 12.99,
    status: "Delivered",
    time: "15 mins ago",
  },
];

const statusColors = {
  Pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  Preparing: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  Ready: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  Delivered: "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
};

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Order Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Live Order Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.items.join(", ")}</TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.time}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Preparation Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 minutes</div>
            <p className="text-xs text-muted-foreground">-2 mins from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orders in Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 orders</div>
            <p className="text-xs text-muted-foreground">+2 in last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 orders</div>
            <p className="text-xs text-muted-foreground">90% satisfaction rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
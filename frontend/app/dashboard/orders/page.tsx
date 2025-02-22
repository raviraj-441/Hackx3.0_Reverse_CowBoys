"use client";

import { useState } from "react";
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

const initialOrders = [
  {
    id: "#101",
    Assigned_tables: "Table 1, Table 2",
    items: ["Latte", "Croissant"],
    price: 8.99,
    status: "Pending",
    time: "2 mins ago",
  },
  {
    id: "#102",
    Assigned_tables: "Table 1, Table 2",
    items: ["Burger", "Fries", "Coke"],
    price: 15.99,
    status: "Preparing",
    time: "5 mins ago",
  },
  {
    id: "#103",
    Assigned_tables: "Table 1, Table 2",
    items: ["Pizza", "Garlic Bread"],
    price: 18.99,
    status: "Ready",
    time: "8 mins ago",
  },
  {
    id: "#104",
    Assigned_tables: "Table 1, Table 2",
    items: ["Caesar Salad", "Iced Tea"],
    price: 12.99,
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
  const [orders, setOrders] = useState(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState({});

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

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
                <TableHead>Assigned Tables</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.Assigned_tables}</TableCell>
                  <TableCell>{order.items.join(", ")}</TableCell>
                  <TableCell>${order.price}</TableCell>
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
                    <Select
                      onValueChange={(value) => handleUpdateStatus(order.id, value)}
                      defaultValue={order.status}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Preparing">Preparing</SelectItem>
                        <SelectItem value="Ready">Ready</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

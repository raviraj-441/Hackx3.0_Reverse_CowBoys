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
    items: [
      { name: "Latte", status: "Pending" },
      { name: "Croissant", status: "Ready" },
    ],
    price: 8.99,
    time: "2 mins ago",
  },
  {
    id: "#102",
    Assigned_tables: "Table 3",
    items: [
      { name: "Burger", status: "Preparing" },
      { name: "Fries", status: "Preparing" },
      { name: "Coke", status: "Ready" },
    ],
    price: 15.99,
    time: "5 mins ago",
  },
  {
    id: "#103",
    Assigned_tables: "Table 4",
    items: [
      { name: "Pizza", status: "Ready" },
      { name: "Garlic Bread", status: "Ready" },
    ],
    price: 18.99,
    time: "8 mins ago",
  },
  {
    id: "#104",
    Assigned_tables: "Table 5",
    items: [
      { name: "Caesar Salad", status: "Delivered" },
      { name: "Iced Tea", status: "Delivered" },
    ],
    price: 12.99,
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

  const handleUpdateItemStatus = (orderId, itemName, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.name === itemName ? { ...item, status: newStatus } : item
              ),
            }
          : order
      )
    );
  };

  // Function to determine overall order status
  const getOrderStatus = (items) => {
    const uniqueStatuses = [...new Set(items.map((item) => item.status))];
    return uniqueStatuses.length === 1 ? uniqueStatuses[0] : "Pending";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const orderStatus = getOrderStatus(order.items);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.Assigned_tables}</TableCell>
                    <TableCell>
                      <ul>
                        {order.items.map((item) => (
                          <li key={item.name} className="flex items-center gap-2">
                            {item.name}
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                statusColors[item.status]
                              }`}
                            >
                              {item.status}
                            </span>
                            <Select
                              onValueChange={(value) =>
                                handleUpdateItemStatus(order.id, item.name, value)
                              }
                              defaultValue={item.status}
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
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>${order.price}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          statusColors[orderStatus]
                        }`}
                      >
                        {orderStatus}
                      </span>
                    </TableCell>
                    <TableCell>{order.time}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

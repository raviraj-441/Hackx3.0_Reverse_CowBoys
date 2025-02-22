"use client";

import { useState, useEffect } from "react";
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

const statusColors = {
  Pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  Preparing: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  Ready: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  Delivered: "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get_order_management");
      const data = await response.json();
      const transformedOrders = transformOrders(data);
      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const transformOrders = (data) => {
    return data.map((order) => {
      const createdAt = new Date(order.created_at);
      const now = new Date();
      const elapsedMinutes = Math.floor((createdAt-now) / 60000); // Convert milliseconds to minutes
  
      return {
        order_id: order.order_id,
        channel_type: order.channel_type,
        assigned_table: order.assigned_tables.length > 0 ? order.assigned_tables.join(", ") : "N/A",
        total_price: order.price,
        preparing_time: elapsedMinutes, // Add preparing time here
        items: order.items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          status: "Pending", // Default status
        })),
        status: "Pending",
      };
    });
  };
  
  const determineOverallStatus = (items) => {
    const uniqueStatuses = new Set(items.map((item) => item.status));
    return uniqueStatuses.size === 1 ? [...uniqueStatuses][0] : "Pending";
  };

  const updateItemStatusFrontend = (orderId, itemName, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.name === itemName ? { ...item, status: newStatus } : item
              ),
              status: determineOverallStatus(
                order.items.map((item) =>
                  item.name === itemName ? { ...item, status: newStatus } : item
                )
              ),
            }
          : order
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
        <Button onClick={fetchOrders}>Refresh Orders</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Order Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Assigned Table</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Preparing Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">#{order.order_id}</TableCell>
                  <TableCell>{order.assigned_table}</TableCell>
                  <TableCell>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{item.name} (x{item.quantity}) - ${item.price}</span>
                          <Select
                            value={item.status}
                            onValueChange={(newStatus) =>
                              updateItemStatusFrontend(order.order_id, item.name, newStatus)
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select Status" />
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
                  <TableCell>${order.total_price}</TableCell>
<TableCell>
  {order.status === "Preparing" || order.status === "Delivered" ? (
    <>
      {order.preparing_time} min
      {order.status === "Delivered" && " ✅"}
    </>
  ) : (
    "N/A"
  )}
</TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
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

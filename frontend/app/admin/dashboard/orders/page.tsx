"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const statusColors = {
  Pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  Preparing: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  Ready: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  Delivered: "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
}

interface Order {
  order_id: number
  channel_type: string
  assigned_table: string
  total_price: number
  preparing_time: number
  items: {
    name: string
    price: number
    quantity: number
    status: string
  }[]
  status: string
}

interface GroupedOrder {
  group_id: number
  order_ids: number[]
  skus: string[]
  sku_names: string[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([])

  useEffect(() => {
    fetchOrders()
    fetchGroupedOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get_order_management")
      const data = await response.json()
      const transformedOrders = transformOrders(data)
      setOrders(transformedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const fetchGroupedOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/group_orders")
      const data = await response.json()
      setGroupedOrders(data)
    } catch (error) {
      console.error("Error fetching grouped orders:", error)
    }
  }

  const transformOrders = (data: any[]): Order[] => {
    return data.map((order) => {
      const createdAt = new Date(order.created_at)
      const now = new Date()
      const elapsedMinutes = Math.abs(Math.floor((createdAt.getTime() - now.getTime()) / 60000)) // Convert milliseconds to minutes

      return {
        order_id: order.order_id,
        channel_type: order.channel_type,
        assigned_table: order.assigned_tables.length > 0 ? order.assigned_tables.join(", ") : "N/A",
        total_price: order.price,
        preparing_time: elapsedMinutes,
        items: order.items.map((item: any) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          status: "Pending",
        })),
        status: "Pending",
      }
    })
  }

  const determineOverallStatus = (items: Order["items"]) => {
    const uniqueStatuses = new Set(items.map((item) => item.status))
    return uniqueStatuses.size === 1 ? [...uniqueStatuses][0] : "Pending"
  }

  const updateItemStatusFrontend = (orderId: number, itemName: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === orderId
          ? {
              ...order,
              items: order.items.map((item) => (item.name === itemName ? { ...item, status: newStatus } : item)),
              status: determineOverallStatus(
                order.items.map((item) => (item.name === itemName ? { ...item, status: newStatus } : item)),
              ),
            }
          : order,
      ),
    )
  }

  const handleCompleteGroup = (groupId: number, orderIds: number[], skuNames: string[]) => {
    // Remove group from UI
    setGroupedOrders(prev => prev.filter(g => g.group_id !== groupId))
  
    // Update only specified items to Ready
    setOrders(prevOrders => prevOrders.map(order => {
      if (!orderIds.includes(order.order_id)) return order
  
      const updatedItems = order.items.map(item => 
        skuNames.includes(item.name) ? { ...item, status: "Ready" } : item
      )
  
      return {
        ...order,
        items: updatedItems,
        status: determineOverallStatus(updatedItems) // Use new status calculation
      }
    }))
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
        <Button
          onClick={() => {
            fetchOrders()
            fetchGroupedOrders()
          }}
        >
          Refresh Orders
        </Button>
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
                          <span>
                            {item.name} (x{item.quantity}) - ${item.price}
                          </span>
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
                    {order.items.every((item) => item.status === "Delivered") ? "✅" : `${order.preparing_time} min`}
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

      <Card>
        <CardHeader>
          <CardTitle>Grouped Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedOrders.map((group) => (
              <Card key={group.group_id}>
                <CardHeader>
                  <CardTitle>Group #{group.group_id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Order IDs:</strong> {group.order_ids.join(", ")}
                  </p>
                  <p>
                    <strong>SKUs:</strong> {group.skus.join(", ")}
                  </p>
                  <ul className="mt-2">
                    {group.sku_names.map((name, index) => (
                      <li key={index} className="text-sm">
                        {name}
                      </li>
                    ))}
                  </ul>
                  <Button
  className="mt-4"
  onClick={() => handleCompleteGroup(
    group.group_id,
    group.order_ids,
    group.sku_names // Pass the SKU names to the handler
  )}
>
  Complete
</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
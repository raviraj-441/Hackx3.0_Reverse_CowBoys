"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bell, CreditCard, DollarSign, Package, TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type SettlementData = {
  [key: string]: {
    total_orders: number
    total_sales: number
    commission_amount: number
  }
}

interface CompanyData {
  created_at: string
  sales: number
}

const salesData = [
  { name: "9AM", value: 240 },
  { name: "10AM", value: 139 },
  { name: "11AM", value: 380 },
  { name: "12PM", value: 450 },
  { name: "1PM", value: 410 },
  { name: "2PM", value: 320 },
  { name: "3PM", value: 280 },
  { name: "4PM", value: 310 },
]

const topItems = [
  { name: "Burger", orders: 45, revenue: 585 },
  { name: "Coffee", orders: 39, revenue: 156 },
  { name: "Pasta", orders: 27, revenue: 405 },
  { name: "Pizza", orders: 25, revenue: 500 },
  { name: "Salad", orders: 22, revenue: 264 },
]

const topWaiters = [
  { name: "John Smith", orders: 25, rating: 4.8 },
  { name: "Lisa Johnson", orders: 22, rating: 4.9 },
  { name: "Mike Wilson", orders: 19, rating: 4.7 },
  { name: "Sarah Davis", orders: 17, rating: 4.8 },
]

export default function DashboardPage() {
  const [settlementData, setSettlementData] = useState<SettlementData | null>(null)
  const [companyData, setCompanyData] = useState<CompanyData[]>([])

  useEffect(() => {
    // Fetch settlement data
    fetch("http://127.0.0.1:8000/api/settlement_master")
      .then((response) => response.json())
      .then((data) => setSettlementData(data))
      .catch((error) => console.error("Error fetching settlement data:", error))

    // Fetch company data
    fetch("http://127.0.0.1:8000/api/company_data")
      .then((response) => response.json())
      .then((data) => setCompanyData(data))
      .catch((error) => console.error("Error fetching company data:", error))
  }, [])

  // Transform company data for the chart
  const transformCompanyData = () => {
    return companyData.map((entry) => ({
      name: new Date(entry.created_at).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        timeZone: 'UTC'
      }),
      value: entry.sales
    }))
  }


  return (
    <div className="space-y-8">
      {/* Flash Sale Alert */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
        <Bell className="h-5 w-5 text-primary" />
        <p className="text-sm font-medium">Flash Sale Active: 50% off on Croissants for the next hour!</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settlementData?.["Online Delivery"]?.total_orders || 0}</div>
            <p className="text-xs text-muted-foreground">Total online delivery orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${settlementData?.["Online Delivery"]?.total_sales.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Total online delivery sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Card Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settlementData?.["Credit Card"]?.total_orders || 0}</div>
            <p className="text-xs text-muted-foreground">Total credit card orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Card Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${settlementData?.["Credit Card"]?.total_sales.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Total credit card sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformCompanyData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "hsl(var(--foreground))" }}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--foreground))" }}
                  padding={{ top: 20, bottom: 0 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                  formatter={(value) => [`$${value}`, 'Sales']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary)/.2)" 
                  name="Sales"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>


      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Selling Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Top Selling Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topItems.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.orders}</TableCell>
                    <TableCell>${item.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Waiter Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Waiter Performance</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={topWaiters}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" padding={{ left: 0, right: 0 }} tick={{ fill: "hsl(var(--foreground))" }} />
                  <YAxis padding={{ top: 20, bottom: 0 }} tick={{ fill: "hsl(var(--foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


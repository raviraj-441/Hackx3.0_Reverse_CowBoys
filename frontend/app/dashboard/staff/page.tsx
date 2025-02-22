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
import { Plus, Star } from "lucide-react";

const staff = [
  {
    id: 1,
    name: "John Smith",
    role: "Waiter",
    shift: "Morning",
    tables: ["Table 1", "Table 2", "Table 3"],
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    name: "Lisa Johnson",
    role: "Waiter",
    shift: "Evening",
    tables: ["Table 4", "Table 5", "Table 6"],
    rating: 4.9,
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Wilson",
    role: "Waiter",
    shift: "Afternoon",
    tables: ["Table 7", "Table 8"],
    rating: 4.7,
    status: "Break",
  },
  {
    id: 4,
    name: "Sarah Davis",
    role: "Waiter",
    shift: "Morning",
    tables: ["Table 9", "Table 10"],
    rating: 4.8,
    status: "Active",
  },
];

const shifts = [
  {
    name: "Morning",
    time: "6:00 AM - 2:00 PM",
    staff: 4,
  },
  {
    name: "Afternoon",
    time: "2:00 PM - 10:00 PM",
    staff: 3,
  },
  {
    name: "Evening",
    time: "4:00 PM - 12:00 AM",
    staff: 4,
  },
];

export default function StaffPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>

      {/* Shift Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {shifts.map((shift) => (
          <Card key={shift.name}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{shift.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shift.staff} Staff</div>
              <p className="text-xs text-muted-foreground">{shift.time}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Staff Overview</CardTitle>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Assigned Tables</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.shift}</TableCell>
                  <TableCell>{member.tables.join(", ")}</TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      {member.rating}{" "}
                      <Star className="ml-1 h-4 w-4 fill-primary text-primary" />
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        member.status === "Active"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
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
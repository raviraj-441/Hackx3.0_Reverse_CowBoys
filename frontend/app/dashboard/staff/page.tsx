"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StaffPage() {
  const [waiters, setWaiters] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/get_allocations");
        const data = await response.json();
        setWaiters(data);
      } catch (error) {
        console.error("Error fetching waiters data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Waiters Overview</h2>
      <Card>
        <CardHeader>
          <CardTitle>Waiters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Assigned Tables</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waiters.map((waiter) => (
                <TableRow key={waiter.id}>
                  <TableCell className="font-medium">{waiter.waiter_name}</TableCell>
                  <TableCell>{waiter.table_no.tables.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

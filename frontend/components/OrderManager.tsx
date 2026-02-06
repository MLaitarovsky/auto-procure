"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- 1. Define the Type explicitly ---
interface PurchaseOrder {
  id: string;
  status: string;
  ai_reasoning: string;
  total_amount: number;
  created_at: string;
}

// --- 2. Use the interface in the props ---
export default function OrderManager({ orders }: { orders: PurchaseOrder[] }) {
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const router = useRouter();

  async function handleApprove(orderId: string) {
    setIsApproving(orderId);

    try {
      await fetch(`http://127.0.0.1:8000/orders/${orderId}/approve`, {
        method: "POST",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.refresh();
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setIsApproving(null);
    }
  }

  if (!orders || orders.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="text-amber-900">
          ⚠️ AI Drafted Orders (Requires Approval)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>AI Reasoning</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="italic text-zinc-600">
                  &quot;{order.ai_reasoning}&quot;
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(order.id)}
                    disabled={isApproving === order.id}
                  >
                    {isApproving === order.id ? "Processing..." : "Approve"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import OrderManager from "@/components/OrderManager"; 

// --- TYPES ---
interface Product {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  min_stock_threshold: number;
  unit_price: number;
}

// --- FETCHERS ---
async function getInventory() {
  const res = await fetch("http://127.0.0.1:8000/inventory", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

async function getOrders() {
  try {
    const res = await fetch("http://127.0.0.1:8000/orders", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function Dashboard() {
  const inventoryData = getInventory();
  const ordersData = getOrders();

  const [products, orders] = await Promise.all([inventoryData, ordersData]);

  const totalValue = products.reduce(
    (acc: number, p: Product) => acc + p.current_stock * p.unit_price,
    0,
  );
  const lowStockCount = products.filter(
    (p: Product) => p.current_stock < p.min_stock_threshold,
  ).length;

  return (
    <div className="p-8 space-y-8 bg-zinc-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Auto-Procure Agent
          </h1>
          <p className="text-zinc-500">Autonomous Supply Chain Monitor</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Trigger Agent (Manual)</Button>
          <Badge
            variant="outline"
            className="px-4 py-1 text-green-600 bg-green-50 border-green-200"
          >
            System Active
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Total Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${lowStockCount > 0 ? "text-red-600" : "text-zinc-900"}`}
            >
              {lowStockCount} Items
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {orders.length}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Awaiting Human Review</p>
          </CardContent>
        </Card>
      </div>

      {/* --- THE INTERACTIVE ORDER MANAGER --- */}
      <OrderManager orders={orders} />

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Inventory Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-500">
                    {product.sku}
                  </TableCell>
                  <TableCell>${product.unit_price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {product.current_stock}
                      <span className="text-zinc-400">
                        / {product.min_stock_threshold} min
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.current_stock < product.min_stock_threshold ? (
                      <Badge variant="destructive">Low Stock</Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700"
                      >
                        Healthy
                      </Badge>
                    )}
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

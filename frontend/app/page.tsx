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

// 1. Define the Shape of our Data (TypeScript Interface)
interface Product {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  min_stock_threshold: number;
  unit_price: number;
}

// 2. The Fetch Function (Running on the Server)
async function getInventory() {
  // We fetch from the Python Backend we just built
  const res = await fetch("http://127.0.0.1:8000/inventory", {
    cache: "no-store", // Ensure we always get fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch inventory");
  }

  return res.json();
}

// 3. The Page Component
export default async function Dashboard() {
  const products: Product[] = await getInventory();

  // Calculate simple stats for the top cards
  const totalValue = products.reduce(
    (acc, p) => acc + p.current_stock * p.unit_price,
    0,
  );
  const lowStockCount = products.filter(
    (p) => p.current_stock < p.min_stock_threshold,
  ).length;

  return (
    <div className="p-8 space-y-8 bg-zinc-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Auto-Procure Agent
          </h1>
          <p className="text-zinc-500">Autonomous Supply Chain Monitor</p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-1 text-green-600 bg-green-50 border-green-200"
        >
          System Active
        </Badge>
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
            {lowStockCount > 0 && (
              <p className="text-xs text-red-500 mt-1">Requires Attention</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Active Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-zinc-500 mt-1">Inventory Monitor</p>
          </CardContent>
        </Card>
      </div>

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
              {products.map((product) => (
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
                        className="bg-green-100 text-green-700 hover:bg-green-100"
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

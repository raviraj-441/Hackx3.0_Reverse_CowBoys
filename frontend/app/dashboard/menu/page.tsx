  "use client";

  import { useEffect, useState } from "react";
  import axios from "axios";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Edit, Plus, Search, Trash } from "lucide-react";
  import Link from "next/link";
  import Image from "next/image";

  const BASE_URL = "http://localhost:8000";

  interface MenuItem {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
    sub_category: string;
    tax: number;
    packaging_charge: number;
    SKU: string;
    product_cost: number;
    variations: { name: string; price: number }[];
    created_at: string;
  }

  export default function MenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingItem, setEditingItem] = useState<{ [key: string]: any }>({});


    useEffect(() => {
      fetchMenuItems();
    }, []);

    // Fetch menu items from API
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/menu-for-admin`);
        console.log("Fetched Data:", response.data); // ✅ Check if data is coming correctly
    
        const formattedData = response.data.map((item: any[]) => ({
          id: item[0],
          name: item[1],
          category: item[2],
          sub_category: item[3],
          tax: parseFloat(item[4]),
          packaging_charge: parseFloat(item[5]),
          SKU: item[6],
          variations: Object.entries(item[7] || {}).map(([name, price]) => ({
            name,
            price,
          })),
          created_at: item[8],
          description: item[9],
          image: item[10],
        }));
    
        console.log("Formatted Data:", formattedData); // ✅ Check if formatting is correct
    
        setMenuItems(formattedData);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
      }
    };
    const handleEditChange = (sku: string, field: keyof MenuItem, value: any) => {
      setEditingItem((prev) => ({
        ...prev,
        [sku]: { ...prev[sku], [field]: value },
      }));
    };
    
    const handleEditSave = async (sku: string) => {
      const updatedFields = editingItem[sku];
      
      if (!updatedFields || Object.keys(updatedFields).length === 0) {
        console.log("No changes to update");
        return;
      }
    
      try {
        await axios.put(`${BASE_URL}/api/menu`, { sku, ...updatedFields }); 
        fetchMenuItems(); // Refresh the menu items
        setEditingItem((prev) => {
          const newState = { ...prev };
          delete newState[sku]; // Clear saved state after update
          return newState;
        });
      } catch (error) {
        console.error("Error updating menu item:", error);
      }
    };
    
    
    
    
    
    
    // Handle delete item
    const handleDelete = async (sku: string) => {
      try {
        await axios.delete(`${BASE_URL}/api/menu/${sku}`);
        setMenuItems(menuItems.filter((item) => item.SKU !== sku));
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    };
    

    // Filtered items based on search
    const filteredItems = menuItems.filter((item) =>
      // console.log("heii")
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
          <Link href="/dashboard/menu/add-item">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub-Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
  {filteredItems.map((item) => (
    <TableRow key={item.id}>
      {/* Image */}
      <TableCell>
        {item.image && (
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
        )}
      </TableCell>

      {/* Editable Name */}
      <TableCell>
        <input
          type="text"
          value={editingItem[item.SKU]?.name ?? item.name}
          onChange={(e) => handleEditChange(item.SKU, "name", e.target.value)}
          onBlur={() => handleEditSave(item.SKU)}
          className="border-none bg-transparent focus:outline-none"
        />
      </TableCell>

      {/* Editable Category */}
      <TableCell>
        <input
          type="text"
          value={editingItem[item.SKU]?.category ?? item.category}
          onChange={(e) => handleEditChange(item.SKU, "category", e.target.value)}
          onBlur={() => handleEditSave(item.SKU)}
          className="border-none bg-transparent focus:outline-none"
        />
      </TableCell>

      {/* Editable Sub-category */}
      <TableCell>
        <input
          type="text"
          value={editingItem[item.SKU]?.sub_category ?? item.sub_category}
          onChange={(e) => handleEditChange(item.SKU, "sub_category", e.target.value)}
          onBlur={() => handleEditSave(item.SKU)}
          className="border-none bg-transparent focus:outline-none"
        />
      </TableCell>

      {/* Editable Price */}
      <TableCell>
        <input
          type="number"
          value={editingItem[item.SKU]?.variations?.[0]?.price ?? item.variations[0]?.price}
          onChange={(e) =>
            handleEditChange(item.SKU, "variations", [{ name: "default", price: Number(e.target.value) }])
          }
          onBlur={() => handleEditSave(item.SKU)}
          className="border-none bg-transparent focus:outline-none"
        />
      </TableCell>

      {/* Editable Tax */}
      <TableCell>
        <input
          type="number"
          value={editingItem[item.SKU]?.tax ?? item.tax}
          onChange={(e) => handleEditChange(item.SKU, "tax", Number(e.target.value))}
          onBlur={() => handleEditSave(item.SKU)}
          className="border-none bg-transparent focus:outline-none"
        />
      </TableCell>

      {/* Non-editable SKU */}
      <TableCell>{item.SKU}</TableCell>

      {/* Non-editable Created Date */}
      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={() => handleEditSave(item.SKU)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.SKU)}>
          <Trash className="h-4 w-4 text-red-500" />
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


import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Plus, Search, Trash } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  sku?: string;
  stock?: number;
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Basic T-Shirt",
      description: "Comfortable cotton t-shirt",
      price: "19.99",
      sku: "TS-001",
      stock: 50
    },
    {
      id: "2",
      name: "Premium Hoodie",
      description: "Warm winter hoodie with front pocket",
      price: "49.99",
      sku: "HD-001",
      stock: 25
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingProduct({
      id: Date.now().toString(),
      name: "",
      description: "",
      price: "",
      sku: "",
      stock: 0
    });
    setIsAddingNew(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({...product});
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!editingProduct) return;

    if (editingProduct.name.trim() === "") {
      toast.error("Product name is required");
      return;
    }

    if (isAddingNew) {
      setProducts([...products, editingProduct]);
      toast.success("Product added successfully");
    } else {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      toast.success("Product updated successfully");
    }
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Product Manager</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search products..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {editingProduct ? (
        <Card>
          <CardHeader>
            <CardTitle>{isAddingNew ? "Add New Product" : "Edit Product"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name *</Label>
              <Input
                id="product-name"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">Price ($) *</Label>
                <Input
                  id="product-price"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-sku">SKU</Label>
                <Input
                  id="product-sku"
                  value={editingProduct.sku}
                  onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="flex-1 h-[calc(100%-100px)]">
          <div className="space-y-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:border-slate-300 transition-colors">
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-md flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-500" />
                        {product.name}
                      </CardTitle>
                      <CardDescription>{product.sku ? `SKU: ${product.sku}` : ""}</CardDescription>
                    </div>
                    <div className="font-semibold">${product.price}</div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock} units
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No products found. Try a different search or add a new product.
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ProductManager;

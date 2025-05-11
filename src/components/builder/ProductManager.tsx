
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Plus, Search, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  stock: number | null;
  user_id?: string;
  website_id?: string;
}

const ProductManager: React.FC = () => {
  const { id: websiteId } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch products from Supabase
  useEffect(() => {
    if (!websiteId) return;
    
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          toast.error("You need to be logged in to manage products");
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("website_id", websiteId);

        if (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to load products");
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error("Error in fetchProducts:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [websiteId]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingProduct({
      id: "",
      name: "",
      description: "",
      price: 0,
      sku: "",
      stock: 0
    });
    setIsAddingNew(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({...product});
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (!editingProduct || !websiteId) return;
    setIsSaving(true);

    try {
      if (editingProduct.name.trim() === "") {
        toast.error("Product name is required");
        setIsSaving(false);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("You need to be logged in to save products");
        setIsSaving(false);
        return;
      }

      const userId = session.session.user.id;

      if (isAddingNew) {
        // Create new product
        const { data, error } = await supabase
          .from("products")
          .insert({
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            sku: editingProduct.sku,
            stock: editingProduct.stock,
            user_id: userId,
            website_id: websiteId
          })
          .select();

        if (error) {
          console.error("Error adding product:", error);
          toast.error("Failed to add product");
          setIsSaving(false);
          return;
        }

        if (data && data.length > 0) {
          setProducts([...products, data[0]]);
          toast.success("Product added successfully");
        }
      } else {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            sku: editingProduct.sku,
            stock: editingProduct.stock
          })
          .eq("id", editingProduct.id)
          .eq("website_id", websiteId);

        if (error) {
          console.error("Error updating product:", error);
          toast.error("Failed to update product");
          setIsSaving(false);
          return;
        }

        setProducts(products.map(p => p.id === editingProduct.id ? {...p, ...editingProduct} : p));
        toast.success("Product updated successfully");
      }

      setEditingProduct(null);
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (!websiteId) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .eq("website_id", websiteId);

      if (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
        return;
      }

      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted");
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("An unexpected error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

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
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">Price ($) *</Label>
                <Input
                  id="product-price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-sku">SKU</Label>
                <Input
                  id="product-sku"
                  value={editingProduct.sku || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                value={editingProduct.stock || 0}
                onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
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
                    <div className="font-semibold">${product.price.toFixed(2)}</div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock !== null ? `${product.stock} units` : 'Not tracked'}
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
                {searchTerm ? (
                  <>No products found. Try a different search or add a new product.</>
                ) : (
                  <>You haven't added any products yet. Click "Add Product" to create your first product.</>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ProductManager;

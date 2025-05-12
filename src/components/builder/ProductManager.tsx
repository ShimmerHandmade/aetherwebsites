import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Package, 
  Plus, 
  Search, 
  Trash, 
  Loader2, 
  FileImage, 
  Tag,
  Tags
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  stock: number | null;
  user_id?: string;
  website_id?: string;
  category?: string | null;
  is_featured?: boolean;
  is_sale?: boolean;
  is_new?: boolean;
  image_url?: string | null;
}

// Simple interface for unique category names
interface UniqueCategory {
  name: string;
}

const ProductManager: React.FC = () => {
  const { id: websiteId } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<UniqueCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");

  // Fetch products and extract unique categories
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

        // Fetch products
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
        
        // Extract unique categories from products
        const uniqueCategories = Array.from(
          new Set(
            data
              ?.filter(product => product.category)
              .map(product => product.category)
          )
        ).map(name => ({ name: name as string }));
            
        setCategories(uniqueCategories);
        
      } catch (error) {
        console.error("Error in fetchProducts:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [websiteId]);

  const filteredProducts = products.filter(product => {
    // Filter by search term
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "featured") return matchesSearch && product.is_featured;
    if (activeTab === "sale") return matchesSearch && product.is_sale;
    if (activeTab === "new") return matchesSearch && product.is_new;
    if (activeTab === "out-of-stock") return matchesSearch && product.stock === 0;
    
    return matchesSearch;
  });

  const handleAddNew = () => {
    setEditingProduct({
      id: "",
      name: "",
      description: "",
      price: 0,
      sku: "",
      stock: 0,
      category: "",
      is_featured: false,
      is_sale: false,
      is_new: true,
      image_url: null
    });
    setImagePreview(null);
    setImageFile(null);
    setIsAddingNew(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({...product});
    setImagePreview(product.image_url || null);
    setImageFile(null);
    setIsAddingNew(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setImageFile(file);
  };
  
  const uploadImage = async (productId: string): Promise<string | null> => {
    if (!imageFile || !websiteId) return null;
    
    try {
      // Check if product-images bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketName = 'product-images';
      
      if (!buckets?.find(b => b.name === bucketName)) {
        await supabase.storage.createBucket(bucketName, { public: true });
      }
      
      // Upload the file
      const filePath = `${websiteId}/${productId}/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, imageFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload product image");
      return null;
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !websiteId) return;
    
    // Add the new category to our local state
    const newCategoryObj = { name: newCategory };
    setCategories([...categories, newCategoryObj]);
    setNewCategory("");
    toast.success("Category added");
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
      
      // Upload the image if there's a new one
      let imageUrl = editingProduct.image_url;
      
      if (isAddingNew) {
        // Create new product
        const newProductData = {
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          sku: editingProduct.sku,
          stock: editingProduct.stock,
          category: editingProduct.category,
          is_featured: editingProduct.is_featured || false,
          is_sale: editingProduct.is_sale || false,
          is_new: editingProduct.is_new || false,
          user_id: userId,
          website_id: websiteId
        };
        
        const { data, error } = await supabase
          .from("products")
          .insert(newProductData)
          .select();

        if (error) {
          console.error("Error adding product:", error);
          toast.error("Failed to add product");
          setIsSaving(false);
          return;
        }

        if (data && data.length > 0) {
          const newProduct = data[0];
          
          // Upload image if there is one
          if (imageFile) {
            imageUrl = await uploadImage(newProduct.id);
            
            if (imageUrl) {
              // Update the product with the image URL
              await supabase
                .from("products")
                .update({ image_url: imageUrl })
                .eq("id", newProduct.id);
                
              newProduct.image_url = imageUrl;
            }
          }
          
          setProducts([...products, newProduct]);
          toast.success("Product added successfully");
          
          // If this product has a new category, add it to our categories list
          if (newProduct.category && !categories.some(c => c.name === newProduct.category)) {
            setCategories([...categories, { name: newProduct.category }]);
          }
        }
      } else {
        // Upload new image if changed
        if (imageFile) {
          imageUrl = await uploadImage(editingProduct.id);
        }
        
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            sku: editingProduct.sku,
            stock: editingProduct.stock,
            category: editingProduct.category,
            is_featured: editingProduct.is_featured || false,
            is_sale: editingProduct.is_sale || false,
            is_new: editingProduct.is_new || false,
            image_url: imageUrl
          })
          .eq("id", editingProduct.id)
          .eq("website_id", websiteId);

        if (error) {
          console.error("Error updating product:", error);
          toast.error("Failed to update product");
          setIsSaving(false);
          return;
        }

        setProducts(products.map(p => p.id === editingProduct.id ? {...editingProduct, image_url: imageUrl} : p));
        toast.success("Product updated successfully");
        
        // If this product has a new category, add it to our categories list
        if (editingProduct.category && !categories.some(c => c.name === editingProduct.category)) {
          setCategories([...categories, { name: editingProduct.category }]);
        }
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
    setImagePreview(null);
    setImageFile(null);
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

      // Also try to delete the product image if it exists
      try {
        await supabase.storage
          .from('product-images')
          .remove([`${websiteId}/${id}`]);
      } catch (imageError) {
        console.log("No images to delete or error removing images:", imageError);
      }

      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted");
      
      // Update categories list if needed
      refreshCategoriesList();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("An unexpected error occurred");
    }
  };
  
  // Function to refresh categories list based on current products
  const refreshCategoriesList = () => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .filter(product => product.category)
          .map(product => product.category)
      )
    ).map(name => ({ name: name as string }));
        
    setCategories(uniqueCategories);
  };
  
  const handleDeleteCategory = (categoryName: string) => {
    setCategories(categories.filter(c => c.name !== categoryName));
    toast.success("Category removed from list");
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView(currentView === "grid" ? "list" : "grid")}
          >
            {currentView === "grid" ? "List View" : "Grid View"}
          </Button>
          <Button onClick={handleAddNew} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="ml-2 flex items-center gap-1">
              <Tags className="h-4 w-4 mr-1" /> Manage Categories
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Product Categories</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleAddCategory}>Add</Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{category.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.name)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-2">No categories yet</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="sale">On Sale</TabsTrigger>
          <TabsTrigger value="new">New Arrivals</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
        </TabsList>
      </Tabs>

      {editingProduct ? (
        <Card>
          <CardHeader>
            <CardTitle>{isAddingNew ? "Add New Product" : "Edit Product"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
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
                  <TextArea
                    id="product-description"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={4}
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
                
                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <div className="flex gap-2">
                    <Select
                      value={editingProduct.category || 'none'} /* Changed from empty string to 'none' */
                      onValueChange={(value) => setEditingProduct({...editingProduct, category: value === 'none' ? '' : value})}
                    >
                      <SelectTrigger id="product-category" className="flex-grow">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem> {/* Changed from empty string to 'none' */}
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input 
                      placeholder="Or type new category..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-grow"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newCategory.trim() !== '') {
                          setEditingProduct({...editingProduct, category: newCategory});
                          setNewCategory('');
                        }
                      }}
                    />
                    
                    <Button 
                      type="button"
                      disabled={!newCategory.trim()} 
                      onClick={() => {
                        if (newCategory.trim()) {
                          setEditingProduct({...editingProduct, category: newCategory});
                          setNewCategory('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="max-h-40 mx-auto object-contain"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 text-red-500"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                            setEditingProduct({...editingProduct, image_url: null});
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4 flex flex-col items-center">
                        <FileImage className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_featured" className="cursor-pointer">Featured Product</Label>
                    <Switch 
                      id="is_featured"
                      checked={editingProduct.is_featured || false}
                      onCheckedChange={(checked) => setEditingProduct({...editingProduct, is_featured: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_sale" className="cursor-pointer">On Sale</Label>
                    <Switch 
                      id="is_sale"
                      checked={editingProduct.is_sale || false}
                      onCheckedChange={(checked) => setEditingProduct({...editingProduct, is_sale: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_new" className="cursor-pointer">New Arrival</Label>
                    <Switch 
                      id="is_new"
                      checked={editingProduct.is_new || false}
                      onCheckedChange={(checked) => setEditingProduct({...editingProduct, is_new: checked})}
                    />
                  </div>
                </div>
              </div>
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
          {filteredProducts.length > 0 ? (
            currentView === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:border-slate-300 transition-colors h-full">
                    <CardHeader className="p-4 pb-2">
                      <div className="w-full aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <CardTitle className="text-md flex items-center gap-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription>{product.sku ? `SKU: ${product.sku}` : ""}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.category && (
                          <Badge variant="outline">
                            <Tag className="h-3 w-3 mr-1" />
                            {product.category}
                          </Badge>
                        )}
                        {product.is_featured && <Badge className="bg-purple-500">Featured</Badge>}
                        {product.is_sale && <Badge className="bg-red-500">Sale</Badge>}
                        {product.is_new && <Badge className="bg-green-500">New</Badge>}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description || 'No description'}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">
                          Stock: {product.stock !== null ? product.stock : 'Not tracked'}
                        </span>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4">
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:border-slate-300 transition-colors">
                    <div className="flex">
                      <div className="h-24 w-24 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-grow p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.sku ? `SKU: ${product.sku}` : ""}</p>
                          </div>
                          <div className="font-bold">${product.price.toFixed(2)}</div>
                        </div>
                        <div className="flex flex-wrap gap-1 my-2">
                          {product.category && (
                            <Badge variant="outline">
                              <Tag className="h-3 w-3 mr-1" />
                              {product.category}
                            </Badge>
                          )}
                          {product.is_featured && <Badge className="bg-purple-500">Featured</Badge>}
                          {product.is_sale && <Badge className="bg-red-500">Sale</Badge>}
                          {product.is_new && <Badge className="bg-green-500">New</Badge>}
                        </div>
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
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? (
                <>No products found. Try a different search or add a new product.</>
              ) : (
                <>You haven't added any products yet. Click "Add Product" to create your first product.</>
              )}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default ProductManager;

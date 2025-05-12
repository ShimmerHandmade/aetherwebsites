
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Search, 
  Loader2,
  Tags,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, UniqueCategory } from "@/types/product";
import { fetchProducts, saveProduct, deleteProduct } from "@/api/productApi";
import ProductForm from "./products/ProductForm";
import ProductGrid from "./products/ProductGrid";
import ProductList from "./products/ProductList";
import CategoriesDialog from "./products/CategoriesDialog";

interface ProductManagerProps {
  websiteId?: string;
  onBackToBuilder?: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ websiteId, onBackToBuilder }) => {
  const { id: websiteIdParam } = useParams<{ id: string }>();
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

  const effectiveWebsiteId = websiteId || websiteIdParam;

  // Fetch products
  useEffect(() => {
    if (!effectiveWebsiteId) return;
    
    const loadProducts = async () => {
      setIsLoading(true);
      const result = await fetchProducts(effectiveWebsiteId);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        setProducts(result.products);
        setCategories(result.categories);
      }
      
      setIsLoading(false);
    };

    loadProducts();
  }, [effectiveWebsiteId]);

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

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !effectiveWebsiteId) return;
    
    // Add the new category to our local state if it doesn't exist already
    if (!categories.some(c => c.name === newCategory)) {
      setCategories([...categories, { name: newCategory }]);
    }
    setNewCategory("");
    toast.success("Category added");
  };

  const handleSave = async () => {
    if (!editingProduct || !effectiveWebsiteId) return;
    setIsSaving(true);

    const result = await saveProduct(
      editingProduct, 
      effectiveWebsiteId, 
      isAddingNew, 
      imageFile
    );

    if (result.success && result.product) {
      if (isAddingNew) {
        setProducts([...products, result.product]);
      } else {
        setProducts(products.map(p => p.id === result.product!.id ? result.product! : p));
      }
      
      // If this product has a new category, add it to our categories list
      if (result.product.category && !categories.some(c => c.name === result.product!.category)) {
        setCategories([...categories, { name: result.product.category }]);
      }
      
      toast.success(isAddingNew ? "Product added successfully" : "Product updated successfully");
      setEditingProduct(null);
    } else {
      toast.error(result.error || "An error occurred");
    }
    
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!effectiveWebsiteId) return;
    
    const result = await deleteProduct(id, effectiveWebsiteId);
    
    if (result.success) {
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted");
      
      // Update categories list if needed
      refreshCategoriesList();
    } else {
      toast.error(result.error || "Failed to delete product");
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

  const handleBackToBuilder = () => {
    if (editingProduct) {
      // If editing, ask for confirmation before navigating away
      if (confirm("You have unsaved product changes. Are you sure you want to go back without saving?")) {
        setEditingProduct(null);
        setImagePreview(null);
        setImageFile(null);
      } 
      return;
    }
    
    // Navigate back to builder if not editing and callback exists
    if (onBackToBuilder) {
      onBackToBuilder();
    }
  };
  
  const handleClearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (editingProduct) {
      setEditingProduct({...editingProduct, image_url: null});
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
        <div className="flex gap-2">
          {editingProduct ? (
            <Button 
              variant="outline" 
              onClick={handleBackToBuilder}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView(currentView === "grid" ? "list" : "grid")}
              >
                {currentView === "grid" ? "List View" : "Grid View"}
              </Button>
              <Button onClick={handleAddNew} className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </>
          )}
        </div>
      </div>

      {!editingProduct && (
        <>
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
            
            <CategoriesDialog
              categories={categories}
              newCategory={newCategory}
              onNewCategoryChange={setNewCategory}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              trigger={
                <Button variant="outline" className="ml-2 flex items-center gap-1">
                  <Tags className="h-4 w-4 mr-1" /> Manage Categories
                </Button>
              }
            />
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
        </>
      )}

      {editingProduct ? (
        <ProductForm
          product={editingProduct}
          categories={categories}
          isAddingNew={isAddingNew}
          isSaving={isSaving}
          onSave={handleSave}
          onCancel={handleCancel}
          onProductChange={setEditingProduct}
          onImageChange={handleImageChange}
          imagePreview={imagePreview}
          onClearImage={handleClearImage}
          newCategory={newCategory}
          onNewCategoryChange={setNewCategory}
          onAddCategory={() => {
            if (newCategory.trim()) {
              setEditingProduct({...editingProduct, category: newCategory});
              setNewCategory('');
            }
          }}
        />
      ) : (
        <ScrollArea className="flex-1 h-[calc(100%-100px)]">
          {filteredProducts.length > 0 ? (
            currentView === "grid" ? (
              <ProductGrid 
                products={filteredProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <ProductList
                products={filteredProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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


import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UniqueCategory } from "@/types/product";
import CategoriesDialog from "./CategoriesDialog";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  categories: UniqueCategory[];
  newCategory: string;
  onNewCategoryChange: (value: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (name: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  categories,
  newCategory,
  onNewCategoryChange,
  onAddCategory,
  onDeleteCategory
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <CategoriesDialog
          categories={categories}
          newCategory={newCategory}
          onNewCategoryChange={onNewCategoryChange}
          onAddCategory={onAddCategory}
          onDeleteCategory={onDeleteCategory}
          trigger={
            <Button variant="outline" className="ml-2 flex items-center gap-1">
              <Tags className="h-4 w-4 mr-1" /> Manage Categories
            </Button>
          }
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="sale">On Sale</TabsTrigger>
          <TabsTrigger value="new">New Arrivals</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};

export default ProductSearch;

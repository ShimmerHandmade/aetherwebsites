
import React, { useEffect, useState } from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fetchProducts } from "@/api/products";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface ProductsListPropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const ProductsListPropertyEditor: React.FC<ProductsListPropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const { id: routeWebsiteId } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<{name: string}[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  const columns = element.props?.columns || 4;
  const productsPerPage = element.props?.productsPerPage || 8;
  const showPagination = element.props?.showPagination !== false;
  const cardStyle = element.props?.cardStyle || "default";
  const sortBy = element.props?.sortBy || "created_at";
  const sortOrder = element.props?.sortOrder || "desc";
  const categoryFilter = element.props?.categoryFilter || "all";
  const websiteId = element.props?.websiteId || routeWebsiteId;
  
  // Fetch available categories for the current website
  useEffect(() => {
    const loadCategories = async () => {
      if (!websiteId) {
        console.warn("No website ID available to fetch categories");
        return;
      }
      
      setIsLoadingCategories(true);
      
      try {
        const { categories, error } = await fetchProducts(websiteId);
        
        if (error) {
          console.error("Failed to load categories:", error);
          toast.error("Failed to load categories");
          return;
        }
        
        if (categories && categories.length > 0) {
          console.log(`Loaded ${categories.length} categories for website ${websiteId}:`, categories);
          setCategories(categories);
        } else {
          console.log(`No categories found for website ${websiteId}`);
        }
      } catch (error) {
        console.error("Exception loading categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, [websiteId]);

  const handleColumnsChange = (value: number[]) => {
    onPropertyChange("columns", value[0]);
  };

  const handleProductsPerPageChange = (value: number[]) => {
    onPropertyChange("productsPerPage", value[0]);
  };

  const handleShowPaginationChange = (checked: boolean) => {
    onPropertyChange("showPagination", checked);
  };

  const handleCardStyleChange = (value: string) => {
    onPropertyChange("cardStyle", value);
  };

  const handleSortByChange = (value: string) => {
    onPropertyChange("sortBy", value);
  };

  const handleSortOrderChange = (value: string) => {
    onPropertyChange("sortOrder", value);
  };

  const handleCategoryFilterChange = (value: string) => {
    onPropertyChange("categoryFilter", value);
  };
  
  const handleWebsiteIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPropertyChange("websiteId", e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Products List Properties</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="websiteId">Website ID (optional)</Label>
            <Input
              id="websiteId"
              value={websiteId || ''}
              onChange={handleWebsiteIdChange}
              placeholder="Current website by default"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Leave empty to use the current website ID
            </p>
          </div>
        
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="columns">Columns: {columns}</Label>
            </div>
            <Slider
              id="columns"
              min={1}
              max={6}
              step={1}
              defaultValue={[columns]}
              onValueChange={handleColumnsChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="productsPerPage">Products per page: {productsPerPage}</Label>
            </div>
            <Slider
              id="productsPerPage"
              min={4}
              max={24}
              step={4}
              defaultValue={[productsPerPage]}
              onValueChange={handleProductsPerPageChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="showPagination" 
              checked={showPagination}
              onCheckedChange={handleShowPaginationChange}
            />
            <Label htmlFor="showPagination">Show pagination</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardStyle">Card Style</Label>
            <Select 
              value={cardStyle} 
              onValueChange={handleCardStyleChange}
            >
              <SelectTrigger id="cardStyle">
                <SelectValue placeholder="Select card style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="shadow">Shadow</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sortBy">Sort Products By</Label>
            <Select 
              value={sortBy} 
              onValueChange={handleSortByChange}
            >
              <SelectTrigger id="sortBy">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Added</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <RadioGroup 
              value={sortOrder} 
              onValueChange={handleSortOrderChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="sort-asc" />
                <Label htmlFor="sort-asc">Ascending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="sort-desc" />
                <Label htmlFor="sort-desc">Descending</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoryFilter">Filter by Category</Label>
            <Select 
              value={categoryFilter} 
              onValueChange={handleCategoryFilterChange}
            >
              <SelectTrigger id="categoryFilter">
                <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="featured">Featured Products</SelectItem>
                <SelectItem value="sale">On Sale</SelectItem>
                <SelectItem value="new">New Arrivals</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsListPropertyEditor;

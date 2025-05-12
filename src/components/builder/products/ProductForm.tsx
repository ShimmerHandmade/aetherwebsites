
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  FileImage, 
  Loader2, 
  Tag,
  Trash
} from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Product, UniqueCategory } from "@/types/product";

interface ProductFormProps {
  product: Product;
  categories: UniqueCategory[];
  isAddingNew: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onProductChange: (product: Product) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  onClearImage: () => void;
  newCategory: string;
  onNewCategoryChange: (category: string) => void;
  onAddCategory: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  isAddingNew,
  isSaving,
  onSave,
  onCancel,
  onProductChange,
  onImageChange,
  imagePreview,
  onClearImage,
  newCategory,
  onNewCategoryChange,
  onAddCategory
}) => {
  return (
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
                value={product.name}
                onChange={(e) => onProductChange({...product, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-description">Description</Label>
              <TextArea
                id="product-description"
                value={product.description || ''}
                onChange={(e) => onProductChange({...product, description: e.target.value})}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">Price ($) *</Label>
                <Input
                  id="product-price"
                  type="number"
                  value={product.price}
                  onChange={(e) => onProductChange({...product, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-sku">SKU</Label>
                <Input
                  id="product-sku"
                  value={product.sku || ''}
                  onChange={(e) => onProductChange({...product, sku: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                value={product.stock || 0}
                onChange={(e) => onProductChange({...product, stock: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-category">Category</Label>
              <div className="flex gap-2">
                <Select
                  value={product.category || 'none'}
                  onValueChange={(value) => onProductChange({...product, category: value === 'none' ? '' : value})}
                >
                  <SelectTrigger id="product-category" className="flex-grow">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
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
                  onChange={(e) => onNewCategoryChange(e.target.value)}
                  className="flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCategory.trim() !== '') {
                      onProductChange({...product, category: newCategory});
                      onNewCategoryChange('');
                    }
                  }}
                />
                
                <Button 
                  type="button"
                  disabled={!newCategory.trim()} 
                  onClick={() => {
                    if (newCategory.trim()) {
                      onProductChange({...product, category: newCategory});
                      onNewCategoryChange('');
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
                      onClick={onClearImage}
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
                  onChange={onImageChange}
                />
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured" className="cursor-pointer">Featured Product</Label>
                <Switch 
                  id="is_featured"
                  checked={product.is_featured || false}
                  onCheckedChange={(checked) => onProductChange({...product, is_featured: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="is_sale" className="cursor-pointer">On Sale</Label>
                <Switch 
                  id="is_sale"
                  checked={product.is_sale || false}
                  onCheckedChange={(checked) => onProductChange({...product, is_sale: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="is_new" className="cursor-pointer">New Arrival</Label>
                <Switch 
                  id="is_new"
                  checked={product.is_new || false}
                  onCheckedChange={(checked) => onProductChange({...product, is_new: checked})}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
          <Button onClick={onSave} disabled={isSaving}>
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
  );
};

export default ProductForm;

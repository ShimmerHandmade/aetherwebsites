
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { ProductFormProps } from "@/types/general";

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onChange,
  categories,
  newCategory,
  onNewCategoryChange,
  onAddCategory,
  imagePreview,
  onImageChange,
  onClearImage,
  planInfo,
  isAddingNew,
  isSaving,
  onSave,
  onCancel
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 px-1">
      <div>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          id="name"
          type="text"
          value={product.name || ""}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
          placeholder="Product name"
        />
        <FormDescription className="mt-1">
          This is the name of the product that will be displayed on your website.
        </FormDescription>
      </div>

      <div>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          id="description"
          value={product.description || ""}
          onChange={(e) => onChange({ ...product, description: e.target.value })}
          placeholder="Product description"
        />
        <FormDescription className="mt-1">
          A brief description of the product.
        </FormDescription>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="price">Price</FormLabel>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={product.price === undefined ? "" : product.price}
            onChange={(e) => onChange({ ...product, price: Number(e.target.value) || 0 })}
            placeholder="0.00"
          />
          <FormDescription className="mt-1">
            The price of the product.
          </FormDescription>
        </div>

        <div>
          <FormLabel htmlFor="sku">SKU</FormLabel>
          <Input
            id="sku"
            type="text"
            value={product.sku || ""}
            onChange={(e) => onChange({ ...product, sku: e.target.value })}
            placeholder="Unique identifier"
          />
          <FormDescription className="mt-1">
            A unique identifier for the product (optional).
          </FormDescription>
        </div>
      </div>

      <div>
        <FormLabel htmlFor="category">Category</FormLabel>
        <div className="flex items-center space-x-2">
          <Select onValueChange={(value) => onChange({ ...product, category: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" defaultValue={product.category} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>
                  Add a new category to the list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel htmlFor="name" className="text-right">
                    Name
                  </FormLabel>
                  <Input id="name" value={newCategory} className="col-span-3" onChange={(e) => onNewCategoryChange(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={onAddCategory}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <FormDescription className="mt-1">
          The category this product belongs to.
        </FormDescription>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="stock">Stock</FormLabel>
          <Input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={product.stock === undefined ? "" : product.stock}
            onChange={(e) => onChange({ ...product, stock: Number(e.target.value) || 0 })}
            placeholder="0"
          />
          <FormDescription className="mt-1">
            Inventory level (optional)
          </FormDescription>
        </div>

        <div>
          <FormLabel htmlFor="weight">Weight (lbs)</FormLabel>
          <Input
            id="weight"
            type="number"
            min="0"
            step="0.1"
            value={product.weight === undefined ? "" : product.weight}
            onChange={(e) => onChange({ ...product, weight: Number(e.target.value) || 0 })}
            placeholder="0.0"
          />
          <FormDescription className="mt-1">
            Product weight for shipping (optional)
          </FormDescription>
        </div>
      </div>

      <div>
        <FormLabel htmlFor="image">Image</FormLabel>
        <div className="flex items-center space-x-4">
          <div className="relative w-32 h-32 rounded-md overflow-hidden">
            {imagePreview || product.image_url ? (
              <img
                src={imagePreview || product.image_url}
                alt="Product Image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-500" />
              </div>
            )}
            {imagePreview || product.image_url ? (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background hover:bg-secondary"
                onClick={onClearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
          <Input
            type="file"
            id="image"
            className="hidden"
            onChange={onImageChange}
          />
          <label
            htmlFor="image"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Upload Image
          </label>
        </div>
        <FormDescription className="mt-1">
          A visual representation of the product.
        </FormDescription>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <FormField
            control={product}
            name="is_featured"
            render={() => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Featured
                  </FormLabel>
                  <FormDescription>
                    Mark this product as featured.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={product.is_featured}
                    onCheckedChange={(e) => onChange({ ...product, is_featured: e })}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={product}
            name="is_new"
            render={() => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    New Arrival
                  </FormLabel>
                  <FormDescription>
                    Mark this product as a new arrival.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={product.is_new}
                    onCheckedChange={(e) => onChange({ ...product, is_new: e })}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={product}
            name="is_sale"
            render={() => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    On Sale
                  </FormLabel>
                  <FormDescription>
                    Mark this product as on sale.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={product.is_sale}
                    onCheckedChange={(e) => onChange({ ...product, is_sale: e })}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Add save/cancel buttons if they are provided */}
      {(onSave || onCancel) && (
        <div className="flex justify-end space-x-2 pt-4 border-t">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving..." : isAddingNew ? "Create Product" : "Save Changes"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductForm;

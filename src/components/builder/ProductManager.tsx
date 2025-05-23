import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { PopoverClose } from "@radix-ui/react-popover"
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { ImageIcon } from '@radix-ui/react-icons';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ProductManagerProps {
  websiteId: string;
}

// In the component where UniqueCategory is used, add an id property:
interface UniqueCategory {
  id: string; // Add this property
  name: string;
}

const ProductManager: React.FC<ProductManagerProps> = ({ websiteId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(true);

  const productFormSchema = z.object({
    name: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    price: z.number().min(0, {
      message: "Price must be a positive number.",
    }),
    category: z.string().optional(),
    stock: z.number().optional(),
    sku: z.string().optional(),
    is_new: z.boolean().default(false).optional(),
    is_featured: z.boolean().default(false).optional(),
    is_sale: z.boolean().default(false).optional(),
    publish_date: z.date().optional(),
    image_url: z.string().optional(),
  })

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      sku: "",
      is_new: false,
      is_featured: false,
      is_sale: false,
      publish_date: new Date(),
      image_url: "",
    },
  })

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [websiteId]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('website_id', websiteId);

      if (error) {
        setError(error.message);
        toast.error('Failed to load products');
      } else {
        setProducts(data || []);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsNewProduct(true);
    setSelectedProduct(null);
    setIsEditing(false);
    form.reset();
    setIsDrawerOpen(true);
  };

  const handleEdit = (product: Product) => {
    setIsNewProduct(false);
    setSelectedProduct(product);
    setIsEditing(true);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      sku: product.sku,
      is_new: product.is_new,
      is_featured: product.is_featured,
      is_sale: product.is_sale,
      publish_date: product.publish_date ? new Date(product.publish_date) : undefined,
      image_url: product.image_url,
    });
    setImageUrl(product.image_url || null);
    setIsDrawerOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (error) {
        toast.error('Failed to delete product');
      } else {
        toast.success('Product deleted successfully');
        loadProducts();
      }
    } catch (err: any) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    try {
      if (isNewProduct) {
        // Create product
        const { error } = await supabase
          .from('products')
          .insert([{
            ...values,
            website_id: websiteId,
            image_url: imageUrl || null,
          }]);

        if (error) {
          toast.error('Failed to create product');
          console.error(error);
        } else {
          toast.success('Product created successfully');
          loadProducts();
        }
      } else if (selectedProduct) {
        // Update product
        const { error } = await supabase
          .from('products')
          .update({
            ...values,
            image_url: imageUrl || null,
          })
          .eq('id', selectedProduct.id);

        if (error) {
          toast.error('Failed to update product');
        } else {
          toast.success('Product updated successfully');
          loadProducts();
        }
      }
    } catch (err: any) {
      toast.error('Failed to save product');
      console.error(err);
    } finally {
      setIsDrawerOpen(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error('Please select an image to upload.');
      return;
    }

    setUploadingImage(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `products/${websiteId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('website-assets')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image: ', error);
        toast.error('Failed to upload image.');
      } else {
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/website-assets/${filePath}`;
        setImageUrl(imageUrl);
        toast.success('Image uploaded successfully!');
      }
    } catch (err: any) {
      console.error('Error uploading image: ', err);
      toast.error('Failed to upload image.');
    } finally {
      setUploadingImage(false);
      setIsImageUploadOpen(false);
    }
  };

  const handleImageRemove = () => {
    setImageUrl(null);
    form.setValue('image_url', '');
    toast.success('Image removed successfully!');
  };

  const extractUniqueCategories = (products: Product[]): UniqueCategory[] => {
    const categories = new Set<string>();

    products.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });

    // Convert to array of objects with id and name properties
    return Array.from(categories).map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'), // Generate an ID from the category name
      name: category
    }));
  };

  const uniqueCategories = useMemo(() => extractUniqueCategories(products), [products]);

  const renderProductRows = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center">Loading products...</TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center text-red-500">Error: {error}</TableCell>
        </TableRow>
      );
    }

    if (products.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center">No products found. Add some!</TableCell>
        </TableRow>
      );
    }

    return products.map((product) => (
      <TableRow key={product.id}>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell>{product.description?.substring(0, 50)}...</TableCell>
        <TableCell>${product.price.toFixed(2)}</TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell>{product.stock}</TableCell>
        <TableCell className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => handleEdit(product)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive" onClick={() => handleDelete(product)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleOpenImageUpload = () => {
    setIsImageUploadOpen(true);
  };

  const handleCloseImageUpload = () => {
    setIsImageUploadOpen(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  const handleClearImage = () => {
    setImageUrl(null);
    form.setValue('image_url', '');
  };

  const hasChanges = () => {
    if (!selectedProduct) return true;

    const currentValues = form.getValues();

    return (
      currentValues.name !== selectedProduct.name ||
      currentValues.description !== selectedProduct.description ||
      currentValues.price !== selectedProduct.price ||
      currentValues.category !== selectedProduct.category ||
      currentValues.stock !== selectedProduct.stock ||
      currentValues.sku !== selectedProduct.sku ||
      currentValues.is_new !== selectedProduct.is_new ||
      currentValues.is_featured !== selectedProduct.is_featured ||
      currentValues.is_sale !== selectedProduct.is_sale ||
      (currentValues.publish_date ? currentValues.publish_date.getTime() : null) !== (selectedProduct.publish_date ? new Date(selectedProduct.publish_date).getTime() : null) ||
      imageUrl !== selectedProduct.image_url
    );
  };

  const isSubmitDisabled = !hasChanges();

  const renderImagePreview = () => {
    if (imageUrl) {
      return (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Product Image"
            className="object-cover rounded-md w-full h-32"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/75 text-muted-foreground hover:text-foreground"
            onClick={handleClearImage}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className="border-dashed border-2 border-muted-foreground rounded-md flex flex-col items-center justify-center h-32 w-full">
          <Package className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No image selected</p>
        </div>
      );
    }
  };

  const renderImageUploadDialog = () => {
    return (
      <Dialog open={isImageUploadOpen} onOpenChange={setIsImageUploadOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Product Image</DialogTitle>
            <DialogDescription>
              Upload an image for your product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="picture" className="text-right">
                Image
              </Label>
              <div className="col-span-3">
                <Input
                  id="picture"
                  type="file"
                  onChange={handleImageFileChange}
                />
              </div>
            </div>
            {imageFile && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="picture" className="text-right">
                  Preview
                </Label>
                <div className="col-span-3">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Uploaded Image"
                      className="object-cover rounded-md"
                    />
                  </AspectRatio>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={handleCloseImageUpload}>
              Cancel
            </Button>
            <Button type="button" onClick={handleImageUpload} disabled={uploadingImage || !imageFile} className="ml-2">
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderProductRows()}
        </TableBody>
      </Table>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{isNewProduct ? 'Create Product' : 'Edit Product'}</DrawerTitle>
            <DrawerDescription>
              {isNewProduct ? 'Create a new product for your website.' : 'Edit the details of your product.'}
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[calc(100vh-10rem)] px-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormControl>
                            <Input id="name" placeholder="Product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormControl>
                            <Textarea id="description" placeholder="Product description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormControl>
                            <Input id="price" type="number" placeholder="Product price" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {uniqueCategories.map((category) => (
                                  <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">
                      Stock
                    </Label>
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormControl>
                            <Input id="stock" type="number" placeholder="Product stock" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right">
                      SKU
                    </Label>
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormControl>
                            <Input id="sku" placeholder="Product SKU" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="is_new" className="text-right">
                      New
                    </Label>
                    <FormField
                      control={form.control}
                      name="is_new"
                      render={({ field }) => (
                        <FormItem className="col-span-3 flex items-center">
                          <FormControl>
                            <Switch
                              id="is_new"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="is_featured" className="text-right">
                      Featured
                    </Label>
                    <FormField
                      control={form.control}
                      name="is_featured"
                      render={({ field }) => (
                        <FormItem className="col-span-3 flex items-center">
                          <FormControl>
                            <Switch
                              id="is_featured"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="is_sale" className="text-right">
                      Sale
                    </Label>
                    <FormField
                      control={form.control}
                      name="is_sale"
                      render={({ field }) => (
                        <FormItem className="col-span-3 flex items-center">
                          <FormControl>
                            <Switch
                              id="is_sale"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="publish_date" className="text-right">
                      Publish Date
                    </Label>
                    <FormField
                      control={form.control}
                      name="publish_date"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date()
                                }
                                initialFocus
                              />
                              <PopoverClose>
                                <Button className="w-full" variant="secondary">
                                  Close
                                </Button>
                              </PopoverClose>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image_url" className="text-right">
                      Image
                    </Label>
                    <div className="col-span-3">
                      {renderImagePreview()}
                      <div className="flex justify-between mt-2">
                        <Button type="button" variant="secondary" onClick={handleOpenImageUpload}>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        {imageUrl && (
                          <Button type="button" variant="destructive" onClick={handleImageRemove}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button type="submit" disabled={isSubmitDisabled}>
                    {isNewProduct ? 'Create' : 'Update'}
                  </Button>
                </DrawerFooter>
              </form>
            </Form>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {renderImageUploadDialog()}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete <span className="font-medium">{productToDelete?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManager;

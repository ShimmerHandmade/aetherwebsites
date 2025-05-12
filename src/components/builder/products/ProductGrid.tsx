
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, Trash } from "lucide-react";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
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
              <Button size="sm" variant="ghost" onClick={() => onDelete(product.id)}>
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;

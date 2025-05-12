
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, Trash } from "lucide-react";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
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
                  <Button size="sm" variant="ghost" onClick={() => onDelete(product.id)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;

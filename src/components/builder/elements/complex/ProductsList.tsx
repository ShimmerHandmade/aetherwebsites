
import React, { useState, useEffect } from 'react';
import { Store, ChevronLeft, ChevronRight, Tag, Truck, AlertCircle, PercentCircle, Package, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BuilderElement } from "@/contexts/BuilderContext";
import { supabase } from "@/integrations/supabase/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  is_featured: boolean;
  is_sale: boolean;
  is_new: boolean;
  sku: string | null;
}

interface ProductsListProps {
  element: BuilderElement;
}

const ProductsList: React.FC<ProductsListProps> = ({ element }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();

  // Extract properties from element props
  const columns = element.props?.columns || 4;
  const productsPerPage = element.props?.productsPerPage || 8;
  const showPagination = element.props?.showPagination !== false;
  const cardStyle = element.props?.cardStyle || "default";
  const sortBy = element.props?.sortBy || "created_at";
  const sortOrder = element.props?.sortOrder || "desc";
  const categoryFilter = element.props?.categoryFilter || "all";

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("products")
          .select("*");
        
        // Apply category filter if specified
        if (categoryFilter !== "all") {
          if (categoryFilter === "featured") {
            query = query.eq("is_featured", true);
          } else if (categoryFilter === "sale") {
            query = query.eq("is_sale", true);
          } else if (categoryFilter === "new") {
            query = query.eq("is_new", true);
          } else {
            query = query.eq("category", categoryFilter);
          }
        }
        
        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === "asc" });
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching products:", error);
          setError("Failed to load products");
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Exception fetching products:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, sortBy, sortOrder]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Get class for grid columns
  const getColumnsClass = () => {
    switch (Number(columns)) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 3: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 4: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      case 5: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
      case 6: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
      default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    }
  };

  // Get card class based on style
  const getCardClass = () => {
    switch (cardStyle) {
      case "bordered": return "border-2 border-gray-200 hover:border-gray-300";
      case "shadow": return "shadow-md hover:shadow-lg";
      case "minimal": return "border-0 shadow-none";
      case "accent": return "border-l-4 border-l-blue-600";
      default: return "border hover:shadow-md";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-gray-700 font-medium">{error}</p>
        <p className="text-gray-500 text-sm mt-1">Please try again later</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-700">No products found</h3>
        <p className="text-gray-500 max-w-md mt-1">
          There are no products available in this category. Check back later for new additions.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className={`grid ${getColumnsClass()} gap-4 mb-6`}>
        {currentProducts.map((product) => (
          <Card key={product.id} className={`${getCardClass()} transition-all overflow-hidden flex flex-col h-full`}>
            <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform" 
                  />
                </Link>
              ) : (
                <Link to={`/product/${product.id}`} className="block w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </Link>
              )}
              
              {/* Product badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.is_new && (
                  <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">New</Badge>
                )}
                {product.is_featured && (
                  <Badge variant="secondary" className="bg-purple-500 hover:bg-purple-600 text-white">Featured</Badge>
                )}
                {product.is_sale && (
                  <Badge variant="secondary" className="bg-red-500 hover:bg-red-600 text-white">Sale</Badge>
                )}
              </div>
            </div>
            
            <CardContent className="flex-grow pt-4">
              <Link to={`/product/${product.id}`} className="block hover:text-blue-600">
                <h3 className="font-medium truncate mb-1">{product.name}</h3>
              </Link>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                {product.category && (
                  <>
                    <Tag className="h-3 w-3 mr-1" />
                    <span className="truncate">{product.category}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="font-bold">${product.price.toFixed(2)}</p>
                <span className="text-xs">
                  {product.stock > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <Truck className="h-3 w-3 mr-1" />
                      In stock
                    </span>
                  ) : (
                    <span className="text-red-500">Out of stock</span>
                  )}
                </span>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <Button 
                onClick={() => handleAddToCart(product)} 
                disabled={product.stock === 0}
                className="w-full"
                size="sm"
              >
                <Store className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {showPagination && totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProductsList;

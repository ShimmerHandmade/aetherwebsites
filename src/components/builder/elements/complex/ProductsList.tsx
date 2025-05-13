import React, { useState, useEffect } from 'react';
import { Store, ChevronLeft, ChevronRight, Tag, Truck, AlertCircle, PercentCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BuilderElement } from "@/contexts/BuilderContext";
import { supabase } from "@/integrations/supabase/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number | null;
  sku: string | null;
  category?: string;
  is_featured?: boolean;
  is_sale?: boolean;
  is_new?: boolean;
  image_url?: string;
}

interface ProductsListProps {
  element: BuilderElement;
}

const ProductsList: React.FC<ProductsListProps> = ({ element }) => {
  const websiteId = window.location.pathname.split('/')[2]; // Extract website ID from URL
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Get display properties from element props or use defaults
  const productsPerPage = element.props?.productsPerPage || 8;
  const columns = element.props?.columns || 4;
  const showPagination = element.props?.showPagination !== false;
  const cardStyle = element.props?.cardStyle || "default";
  const sortBy = element.props?.sortBy || "created_at";
  const sortOrder = element.props?.sortOrder || "desc";
  const categoryFilter = element.props?.categoryFilter || "all";

  // Fetch products with pagination
  useEffect(() => {
    if (!websiteId) return;
    
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      try {
        // Build the query based on filters and sorting
        let query = supabase
          .from("products")
          .select("*")
          .eq("website_id", websiteId);
        
        // Apply category filters if specified
        if (categoryFilter === "featured") {
          query = query.eq("is_featured", true);
        } else if (categoryFilter === "sale") {
          query = query.eq("is_sale", true);
        } else if (categoryFilter === "new") {
          query = query.eq("is_new", true);
        }
        
        // Get count for pagination - Fix: use separate count query
        const countQuery = supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("website_id", websiteId);
        
        // Apply same filters to count query
        if (categoryFilter === "featured") {
          countQuery.eq("is_featured", true);
        } else if (categoryFilter === "sale") {
          countQuery.eq("is_sale", true);
        } else if (categoryFilter === "new") {
          countQuery.eq("is_new", true);
        }
        
        const { count: itemCount, error: countError } = await countQuery;
        
        if (countError) {
          console.error("Error counting products:", countError);
          return;
        }
        
        setTotalItems(itemCount || 0);
        const calculatedTotalPages = Math.max(1, Math.ceil((itemCount || 0) / productsPerPage));
        setTotalPages(calculatedTotalPages);
        
        // Fetch paginated products
        const from = (currentPage - 1) * productsPerPage;
        const to = from + productsPerPage - 1;
        
        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })
          .range(from, to);
        
        const { data, error } = await query;

        if (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to load products");
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error("Error in fetchProducts:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, [websiteId, currentPage, productsPerPage, sortBy, sortOrder, categoryFilter]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Dynamic column classes based on columns prop
  const getColumnClasses = () => {
    const columnMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
      6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
    };
    return columnMap[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  };

  // Get card styles based on cardStyle prop
  const getCardStyle = () => {
    const styles: Record<string, string> = {
      default: "",
      bordered: "border-2",
      shadow: "shadow-lg",
      minimal: "border-0 shadow-none",
      accent: "border-l-4 border-l-blue-500"
    };
    return styles[cardStyle] || "";
  };

  if (isProductsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mr-2"></div>
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {products.length > 0 ? (
        <>
          <div className={`grid ${getColumnClasses()} gap-6 mb-6`}>
            {products.map((product) => (
              <Card key={product.id} className={`overflow-hidden flex flex-col ${getCardStyle()}`}>
                <Link to={`/product/${product.id}`} className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden relative">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="h-12 w-12 text-gray-400" />
                  )}
                  
                  {/* Product badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.is_featured && (
                      <Badge className="bg-purple-500">Featured</Badge>
                    )}
                    {product.is_sale && (
                      <Badge className="bg-red-500">Sale</Badge>
                    )}
                    {product.is_new && (
                      <Badge className="bg-green-500">New</Badge>
                    )}
                  </div>
                </Link>
                <CardHeader className="pb-2">
                  <Link to={`/product/${product.id}`}>
                    <CardTitle className="text-lg hover:text-blue-600 transition-colors">{product.name}</CardTitle>
                  </Link>
                  {product.category && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Tag className="h-3 w-3 mr-1" />
                      {product.category}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <p className="text-sm text-gray-500 line-clamp-3">{product.description || 'No description available'}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    {product.is_sale && (
                      <span className="text-xs text-red-500 flex items-center">
                        <PercentCircle className="h-3 w-3 mr-1" />
                        On Sale
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    {product.stock === 0 ? (
                      <span className="text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Out of Stock
                      </span>
                    ) : product.stock !== null ? (
                      <span className="text-green-500 flex items-center">
                        <Truck className="h-3 w-3 mr-1" />
                        {product.stock} in stock
                      </span>
                    ) : (
                      'Stock not tracked'
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {showPagination && totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                </PaginationItem>
                
                {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                  // Always show current page and adjust the range accordingly
                  let pageToShow = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageToShow = currentPage - 3 + i;
                    if (pageToShow > totalPages) {
                      pageToShow = totalPages - (4 - i);
                    }
                  }
                  return pageToShow;
                }).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
          <Store className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">You haven't added any products to your store yet.</p>
          <Button onClick={() => window.location.href = `/builder/${websiteId}/products`}>
            Add Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;

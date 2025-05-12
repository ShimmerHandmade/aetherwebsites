
import React, { useState, useEffect } from 'react';
import { Store, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BuilderElement } from "@/contexts/BuilderContext";
import { supabase } from "@/integrations/supabase/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number | null;
  sku: string | null;
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
  
  // Get display properties from element props or use defaults
  const productsPerPage = element.props?.productsPerPage || 8;
  const columns = element.props?.columns || 4;
  const showPagination = element.props?.showPagination !== false;
  const cardStyle = element.props?.cardStyle || "default";

  // Fetch products with pagination
  useEffect(() => {
    if (!websiteId) return;
    
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      try {
        // Get count for pagination
        const { count, error: countError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("website_id", websiteId);
        
        if (countError) {
          console.error("Error counting products:", countError);
          return;
        }
        
        const totalItems = count || 0;
        const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / productsPerPage));
        setTotalPages(calculatedTotalPages);
        
        // Fetch paginated products
        const from = (currentPage - 1) * productsPerPage;
        const to = from + productsPerPage - 1;
        
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("website_id", websiteId)
          .order('created_at', { ascending: false })
          .range(from, to);

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
  }, [websiteId, currentPage, productsPerPage]);

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
                <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
                  <Store className="h-12 w-12 text-gray-400" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <p className="text-sm text-gray-500 line-clamp-3">{product.description || 'No description available'}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-2">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <div className="text-sm text-gray-500">
                    {product.stock !== null ? `${product.stock} in stock` : 'Stock not tracked'}
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
                
                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
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

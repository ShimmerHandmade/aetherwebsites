
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Store } from "lucide-react";
import { useWebsite } from "@/hooks/useWebsite";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number | null;
  sku: string | null;
}

const BuilderShop = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { website, isLoading, websiteName } = useWebsite(id, navigate);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 20;

  // Fetch products with pagination
  useEffect(() => {
    if (!id) return;
    
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      try {
        // Get count for pagination
        const { count, error: countError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("website_id", id);
        
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
          .eq("website_id", id)
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
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
          <p className="text-gray-600 mb-6">The website you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(`/builder/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Shop - {websiteName}</h1>
              <p className="text-gray-500">Displaying all products available in your store</p>
            </div>
            <Button 
              onClick={() => navigate(`/builder/${id}/products`)} 
              className="flex items-center gap-1"
            >
              Manage Products
            </Button>
          </div>
          
          {isProductsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mr-2"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden flex flex-col">
                      <div className="bg-gray-100 h-48 flex items-center justify-center">
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
              ) : (
                <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">You haven't added any products to your store yet.</p>
                  <Button onClick={() => navigate(`/builder/${id}/products`)}>
                    Add Products
                  </Button>
                </div>
              )}
              
              {totalPages > 1 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderShop;


import React, { useState, useEffect } from 'react';
import { Store, Package, Loader2, AlertCircle, Tag, Truck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BuilderElement } from "@/contexts/BuilderContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useParams } from "react-router-dom";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { fetchProducts } from "@/api/products";
import { Product } from "@/types/product";

interface ProductsListProps {
  element: BuilderElement;
  isPreviewMode?: boolean;
  isLiveSite?: boolean;
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  element, 
  isPreviewMode = false, 
  isLiveSite = false 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { id: routeWebsiteId } = useParams<{ id: string }>();
  
  // Check if we're in a live site by also looking at window.__SITE_SETTINGS__
  const globalSettings = window.__SITE_SETTINGS__;
  const isSiteLive = isLiveSite || (globalSettings && globalSettings.isLiveSite);
  
  console.log("ProductsList - Site Live Check:", { 
    isLiveSite, 
    globalSettings, 
    isSiteLive 
  });
  
  // Handle potential cart context errors safely with proper typing
  let cartFunctions = { addToCart: (product: Product) => {} };
  try {
    cartFunctions = useCart();
  } catch (err) {
    console.log("Cart context not available, using placeholder");
  }
  const { addToCart } = cartFunctions;
  
  // Get website ID from element props or route params
  const websiteId = element.props?.websiteId || routeWebsiteId || (globalSettings && globalSettings.siteId);

  // Extract properties from element props
  const columns = element.props?.columns || 4;
  const productsPerPage = element.props?.productsPerPage || 8;
  const showPagination = element.props?.showPagination !== false;
  const cardStyle = element.props?.cardStyle || "default";
  const sortBy = element.props?.sortBy || "created_at";
  const sortOrder = element.props?.sortOrder || "desc";
  const categoryFilter = element.props?.categoryFilter || "all";

  // Load products - in all cases fetch real data, just use mock data as fallback
  useEffect(() => {
    const loadProducts = async () => {
      if (!websiteId) {
        console.warn("No website ID available to fetch products");
        // Create fallback mock data only if no website ID is available
        const mockProducts: Product[] = Array(8).fill(null).map((_, i) => ({
          id: `mock-${i}`,
          name: `Sample Product ${i + 1}`,
          description: 'This is a sample product description.',
          price: 19.99 + i,
          stock: 10 + i,
          image_url: null,
          category: i % 2 === 0 ? 'Category A' : 'Category B',
          is_featured: i % 4 === 0,
          is_sale: i % 3 === 0,
          is_new: i % 5 === 0,
          sku: `SKU-00${i}`,
          website_id: 'mock-website-id'
        }));
        setProducts(mockProducts);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      console.log(`Fetching products for website: ${websiteId}`);

      try {
        // Use the fetchProducts API function for consistent data fetching
        const result = await fetchProducts(websiteId);
        
        if (result.error) {
          console.error("Error fetching products:", result.error);
          setError(result.error);
          return;
        }
        
        // Filter and sort products based on element properties
        let filteredProducts = [...result.products];
        
        // Apply category filter
        if (categoryFilter !== "all") {
          if (categoryFilter === "featured") {
            filteredProducts = filteredProducts.filter(p => p.is_featured);
          } else if (categoryFilter === "sale") {
            filteredProducts = filteredProducts.filter(p => p.is_sale);
          } else if (categoryFilter === "new") {
            filteredProducts = filteredProducts.filter(p => p.is_new);
          } else {
            filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
          }
        }
        
        // Apply sorting
        filteredProducts.sort((a, b) => {
          // Handle numeric fields
          if (sortBy === 'price' || sortBy === 'stock') {
            const aValue = a[sortBy] || 0;
            const bValue = b[sortBy] || 0;
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          }
          
          // Handle string fields
          const aValue = String(a[sortBy] || '');
          const bValue = String(b[sortBy] || '');
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        });
        
        console.log(`Fetched and processed ${filteredProducts.length} products for website ${websiteId}`);
        setProducts(filteredProducts);
      } catch (err) {
        console.error("Exception fetching products:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [websiteId, categoryFilter, sortBy, sortOrder]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    // Make sure we stop propagation and prevent default for add to cart button
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Add to cart clicked - isSiteLive:", isSiteLive);
    
    // Only add to cart in live site mode
    if (!isSiteLive) {
      console.log("Not adding to cart - not in live site mode");
      return;
    }
    
    console.log("Adding to cart:", product.name);
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Could not add to cart. Please try again.");
    }
  };
  
  const handleProductClick = (e: React.MouseEvent, product: Product) => {
    // Make sure to log for debugging
    console.log("Product clicked - isSiteLive:", isSiteLive);
    
    if (!isSiteLive) {
      console.log("Not navigating - not in live site mode");
      e.preventDefault();
      return; // Only navigate in live site mode
    }

    e.preventDefault();
    e.stopPropagation();
    
    if (!websiteId) {
      console.log("Not navigating - no website ID");
      return; // Need website ID to navigate
    }
    
    console.log("Navigating to product:", product.id, "Site ID:", websiteId);
    
    // Determine the correct URL format based on the current path
    const baseUrl = window.location.pathname.includes('/view/') 
      ? `/view/${websiteId}` 
      : `/site/${websiteId}`;
    
    navigate(`${baseUrl}/product/${product.id}`);
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
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-gray-700 font-medium">{error}</p>
        <p className="text-gray-500 text-sm mt-1">Please try again later</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <Package className="h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-700">No products found</h3>
        <p className="text-gray-500 max-w-md mt-1">
          {websiteId ? 
            "There are no products available in this category. Check back later for new additions." :
            "No website ID found to fetch products. Please make sure you're in a valid website context."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      <div className={`grid ${getColumnsClass()} gap-6 mb-8`}>
        {currentProducts.map((product) => (
          <Card 
            key={product.id} 
            className={`${getCardClass()} transition-all overflow-hidden flex flex-col h-full ${isSiteLive ? 'cursor-pointer hover:brightness-95' : ''}`}
            onClick={(e) => isSiteLive ? handleProductClick(e, product) : undefined}
            role={isSiteLive ? "link" : undefined}
            aria-label={isSiteLive ? `View details for ${product.name}` : undefined}
          >
            <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className={`w-full h-full object-cover ${isSiteLive ? 'hover:scale-105 transition-transform' : ''}`}
                />
              ) : (
                <Package className="h-16 w-16 text-gray-400" />
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
              <h3 className={`font-medium truncate mb-1 ${isSiteLive ? 'hover:text-blue-600' : ''}`}>{product.name}</h3>
              
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
                onClick={(e) => handleAddToCart(e, product)} 
                disabled={product.stock === 0 || !isSiteLive}
                className="w-full relative z-10 pointer-events-auto"
                size="sm"
                data-testid="add-to-cart-button"
              >
                <Store className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Pagination controls */}
      {showPagination && totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <Button 
                variant="ghost"
                onClick={() => isSiteLive && setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || !isSiteLive}
                className="flex items-center gap-1"
              >
                <span>Previous</span>
              </Button>
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <Button
                  variant={currentPage === i + 1 ? "outline" : "ghost"}
                  onClick={() => isSiteLive && setCurrentPage(i + 1)}
                  disabled={!isSiteLive}
                  className="w-10"
                >
                  {i + 1}
                </Button>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() => isSiteLive && setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || !isSiteLive}
                className="flex items-center gap-1"
              >
                <span>Next</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProductsList;

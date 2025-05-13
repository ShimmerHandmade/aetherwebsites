
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Star, ChevronRight, Tag, AlertCircle, PercentCircle, Package } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) {
          console.error("Error fetching product:", error);
          toast.error("Product not found");
          navigate('/');
          return;
        }
        
        setProduct(data);
      } catch (error) {
        console.error("Error in fetchProduct:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">ModernBuilder Store</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/cart')}
              className="relative"
            >
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>{product.category || 'Products'}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <span className="font-medium text-gray-800">{product.name}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center h-[400px]">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain" 
              />
            ) : (
              <Package className="h-32 w-32 text-gray-400" />
            )}
          </div>

          {/* Product info */}
          <div>
            {/* Product badges */}
            <div className="flex gap-2 mb-3">
              {product.is_featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Star className="w-3 h-3 mr-1" /> Featured
                </span>
              )}
              {product.is_new && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  New
                </span>
              )}
              {product.is_sale && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <PercentCircle className="w-3 h-3 mr-1" /> Sale
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <Tag className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">{product.category || 'Uncategorized'}</span>
            </div>
            
            <div className="border-t border-gray-200 my-4 pt-4"></div>
            
            <p className="text-2xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
            
            {product.sku && (
              <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
            )}
            
            <div className="mt-2 mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{product.description || 'No description available'}</p>
            </div>
            
            <div className="border-t border-gray-200 my-4 pt-4"></div>
            
            {/* Stock status */}
            <div className="mb-6">
              {product.stock === 0 ? (
                <div className="text-red-500 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Out of stock
                </div>
              ) : product.stock !== null ? (
                <div className="text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  In stock ({product.stock} available)
                </div>
              ) : (
                <div className="text-gray-500">Stock not tracked</div>
              )}
            </div>
            
            {/* Add to cart button */}
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleGoBack}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">© {new Date().getFullYear()} ModernBuilder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;

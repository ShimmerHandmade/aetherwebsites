
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "@/api/products";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft, Store, Tag, Truck, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ProductDetailsProps {
  productId?: string | null;
  siteId?: string | null;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId: propProductId, siteId: propSiteId }) => {
  const params = useParams<{ id?: string; productId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get IDs either from props or from URL params
  const siteId = propSiteId || params.id;
  const productId = propProductId || params.productId;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  
  console.log("ProductDetails component loaded with:", {
    siteId,
    productId,
    currentPath: location.pathname
  });
  
  // Fetch product details
  useEffect(() => {
    const loadProduct = async () => {
      if (!siteId || !productId) {
        console.error("Missing product or website information:", { siteId, productId });
        setError("Missing product or website information");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log(`Fetching products for site: ${siteId}`);
        const result = await fetchProducts(siteId);
        
        if (result.error) {
          console.error("Failed to load products:", result.error);
          setError("Failed to load products");
          setIsLoading(false);
          return;
        }
        
        console.log(`Found ${result.products.length} products, looking for product: ${productId}`);
        const foundProduct = result.products.find(p => p.id === productId);
        
        if (!foundProduct) {
          console.error("Product not found in results");
          setError("Product not found");
          setIsLoading(false);
          return;
        }
        
        console.log("Product found:", foundProduct);
        setProduct(foundProduct);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [siteId, productId]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Could not add to cart. Please try again.");
    }
  };
  
  const handleBackToProducts = () => {
    const currentPath = location.pathname;
    if (currentPath.includes('/view/')) {
      navigate(`/view/${siteId}`);
    } else if (currentPath.includes('/site/')) {
      navigate(`/site/${siteId}`);
    } else {
      navigate('/');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The requested product could not be found."}</p>
          <Button onClick={handleBackToProducts}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBackToProducts} className="flex items-center text-gray-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
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
        
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            {product.category && (
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Tag className="h-4 w-4 mr-1" />
                <span>{product.category}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-4">
              {product.is_new && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">New</span>
              )}
              {product.is_featured && (
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Featured</span>
              )}
              {product.is_sale && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Sale</span>
              )}
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-4">
              ${product.price.toFixed(2)}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{product.description || "No description available for this product."}</p>
            </div>
            
            <div className="flex items-center mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              size="lg"
              className="w-full"
            >
              <Store className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            {product.sku && (
              <p className="text-xs text-gray-500 mt-4">SKU: {product.sku}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

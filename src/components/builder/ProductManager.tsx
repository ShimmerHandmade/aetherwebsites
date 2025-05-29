
import React from 'react';
import SimpleProductManager from './SimpleProductManager';

interface ProductManagerProps {
  websiteId?: string;
  onBackToBuilder?: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = (props) => {
  return <SimpleProductManager {...props} />;
};

export default ProductManager;

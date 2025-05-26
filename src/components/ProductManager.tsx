
import React from 'react';
import { useParams } from 'react-router-dom';
import BuilderProductManager from '@/components/builder/ProductManager';

const ProductManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return <BuilderProductManager websiteId={id} />;
};

export default ProductManager;

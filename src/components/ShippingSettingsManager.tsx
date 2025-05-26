
import React from 'react';
import BuilderShippingSettingsManager from '@/components/builder/ShippingSettingsManager';

interface ShippingSettingsManagerProps {
  websiteId: string;
}

const ShippingSettingsManager: React.FC<ShippingSettingsManagerProps> = ({ websiteId }) => {
  return <BuilderShippingSettingsManager />;
};

export default ShippingSettingsManager;


import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSaveManager } from './useSaveManager';

interface Order {
  id: string;
  user_id: string | null;
  website_id: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  billing_address: any;
  payment_info: any;
  shipping_method: string | null;
  shipping_cost: number | null;
  created_at: string;
  updated_at: string;
  order_items?: Array<{
    id: string;
    product_name: string;
    product_image_url: string | null;
    quantity: number;
    price_at_purchase: number;
  }>;
}

export function useOrderManager(websiteId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const saveManager = useSaveManager({
    onSave: async () => {
      if (!editingOrder || !websiteId) return false;

      try {
        const { error } = await supabase
          .from('orders')
          .update({
            status: editingOrder.status,
            shipping_method: editingOrder.shipping_method,
            shipping_cost: editingOrder.shipping_cost,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingOrder.id);

        if (error) throw error;

        // Refresh orders
        await fetchOrders();
        setEditingOrder(null);
        return true;
      } catch (error) {
        console.error('Error updating order:', error);
        return false;
      }
    }
  });

  const fetchOrders = useCallback(async () => {
    if (!websiteId) return;

    try {
      setLoading(true);
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_image_url,
            quantity,
            price_at_purchase
          )
        `)
        .eq('website_id', websiteId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [websiteId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleEdit = useCallback((order: Order) => {
    setEditingOrder({ ...order });
  }, []);

  const handleCancel = useCallback(() => {
    setEditingOrder(null);
  }, []);

  const handleOrderChange = useCallback((updatedOrder: Order) => {
    setEditingOrder(updatedOrder);
    saveManager.markAsUnsaved();
  }, [saveManager]);

  return {
    orders,
    loading,
    error,
    editingOrder,
    setEditingOrder: handleOrderChange,
    handleEdit,
    handleCancel,
    handleSave: saveManager.save,
    isSaving: saveManager.isSaving,
    saveStatus: saveManager.getSaveStatus(),
    hasUnsavedChanges: saveManager.hasUnsavedChanges,
    refreshOrders: fetchOrders
  };
}

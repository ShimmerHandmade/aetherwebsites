import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Package, Calendar, DollarSign, User, MapPin, CreditCard, Truck, Eye, Edit2, Save, X, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Order {
  id: string;
  user_id: string | null;
  website_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  shipping_address: any;
  billing_address: any;
  payment_info: any;
  shipping_cost: number | null;
  shipping_method: string | null;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string | null;
  product_image_url: string | null;
  quantity: number;
  price_at_purchase: number;
}

interface EditableOrderData {
  shipping_address: any;
  billing_address: any;
  shipping_method: string | null;
  shipping_cost: number | null;
  order_items: OrderItem[];
}

const Orders = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditableOrderData | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [id]);

  const fetchOrders = async () => {
    if (!id) return;
    
    try {
      // Fetch only completed orders with their order items
      const { data, error } = await supabase
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
        .eq('website_id', id)
        .eq('status', 'completed')  // Only show completed orders
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load completed orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const startEditing = (order: Order) => {
    setEditingOrder(order.id);
    setEditData({
      shipping_address: order.shipping_address || {},
      billing_address: order.billing_address || {},
      shipping_method: order.shipping_method,
      shipping_cost: order.shipping_cost,
      order_items: order.order_items || []
    });
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditData(null);
  };

  const saveOrderEdits = async () => {
    if (!editingOrder || !editData) return;

    setSavingEdit(true);
    try {
      // Update main order details
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          shipping_address: editData.shipping_address,
          billing_address: editData.billing_address,
          shipping_method: editData.shipping_method,
          shipping_cost: editData.shipping_cost,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingOrder);

      if (orderError) throw orderError;

      // Update order items quantities and prices
      for (const item of editData.order_items) {
        const { error: itemError } = await supabase
          .from('order_items')
          .update({
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
            product_name: item.product_name
          })
          .eq('id', item.id);

        if (itemError) throw itemError;
      }

      // Recalculate total amount
      const itemsTotal = editData.order_items.reduce((sum, item) => 
        sum + (item.price_at_purchase * item.quantity), 0
      );
      const totalAmount = itemsTotal + (editData.shipping_cost || 0);

      const { error: totalError } = await supabase
        .from('orders')
        .update({ total_amount: totalAmount })
        .eq('id', editingOrder);

      if (totalError) throw totalError;

      // Update local state
      setOrders(orders.map(order => 
        order.id === editingOrder 
          ? { 
              ...order, 
              ...editData,
              total_amount: totalAmount,
              updated_at: new Date().toISOString()
            }
          : order
      ));

      if (selectedOrder && selectedOrder.id === editingOrder) {
        setSelectedOrder({
          ...selectedOrder,
          ...editData,
          total_amount: totalAmount,
          updated_at: new Date().toISOString()
        });
      }

      setEditingOrder(null);
      setEditData(null);
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setSavingEdit(false);
    }
  };

  const updateEditData = (field: string, value: any) => {
    if (!editData) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditData({
        ...editData,
        [parent]: {
          ...editData[parent as keyof EditableOrderData],
          [child]: value
        }
      });
    } else {
      setEditData({
        ...editData,
        [field]: value
      });
    }
  };

  const updateOrderItem = (itemIndex: number, field: string, value: any) => {
    if (!editData) return;
    
    const updatedItems = [...editData.order_items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      [field]: value
    };
    
    setEditData({
      ...editData,
      order_items: updatedItems
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'awaiting_payment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCustomerInfo = (order: Order) => {
    const customerInfo = order.payment_info?.customer_info || {};
    const shippingAddress = order.shipping_address || {};
    const billingAddress = order.billing_address || {};
    
    return {
      email: customerInfo.email || shippingAddress.email || billingAddress.email || 'No email provided',
      name: customerInfo.name || shippingAddress.name || billingAddress.name || 'No name provided',
      phone: customerInfo.phone || shippingAddress.phone || billingAddress.phone || null
    };
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No address provided';
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ') || 'No address provided';
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading completed orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/builder/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Completed Orders</h1>
              <p className="text-gray-600">View and edit completed orders for your website</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Check className="h-4 w-4 mr-1" />
              {orders.length} Completed Orders
            </Badge>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed orders yet</h3>
              <p className="text-gray-600">Completed orders will appear here for management and editing</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const customerInfo = getCustomerInfo(order);
              const isEditing = editingOrder === order.id;
              
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {customerInfo.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xl font-bold">${order.total_amount}</span>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {!isEditing ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => startEditing(order)}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Order Details - #{order.id.slice(-8)}</DialogTitle>
                                    <DialogDescription>
                                      Complete order information
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedOrder && (
                                    <div className="space-y-6">
                                      {/* Customer Information */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-base flex items-center">
                                              <User className="h-4 w-4 mr-2" />
                                              Customer Information
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <div>
                                              <p className="text-sm text-gray-500">Email</p>
                                              <p className="font-medium">{customerInfo.email}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Name</p>
                                              <p className="font-medium">{customerInfo.name}</p>
                                            </div>
                                            {customerInfo.phone && (
                                              <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-medium">{customerInfo.phone}</p>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>

                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-base flex items-center">
                                              <MapPin className="h-4 w-4 mr-2" />
                                              Shipping Address
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-sm">{formatAddress(selectedOrder.shipping_address)}</p>
                                          </CardContent>
                                        </Card>
                                      </div>

                                      {/* Payment & Shipping Info */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-base flex items-center">
                                              <CreditCard className="h-4 w-4 mr-2" />
                                              Payment Information
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <div>
                                              <p className="text-sm text-gray-500">Payment Method</p>
                                              <p className="font-medium capitalize">
                                                {selectedOrder.payment_info?.method === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Total Amount</p>
                                              <p className="font-medium">${selectedOrder.total_amount}</p>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-base flex items-center">
                                              <Truck className="h-4 w-4 mr-2" />
                                              Shipping Information
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <div>
                                              <p className="text-sm text-gray-500">Shipping Method</p>
                                              <p className="font-medium">{selectedOrder.shipping_method || 'Standard'}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Shipping Cost</p>
                                              <p className="font-medium">${selectedOrder.shipping_cost?.toFixed(2) || '0.00'}</p>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>

                                      {/* Order Items */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-base">Order Items</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-3">
                                            {selectedOrder.order_items?.map((item, index) => (
                                              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                                <div className="flex items-center">
                                                  {item.product_image_url && (
                                                    <img 
                                                      src={item.product_image_url} 
                                                      alt={item.product_name || 'Product'}
                                                      className="w-12 h-12 object-cover rounded mr-3"
                                                    />
                                                  )}
                                                  <div>
                                                    <p className="font-medium">{item.product_name || 'Unknown Product'}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                  </div>
                                                </div>
                                                <p className="font-medium">${(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={cancelEditing}
                                disabled={savingEdit}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={saveOrderEdits}
                                disabled={savingEdit}
                              >
                                {savingEdit ? (
                                  <div className="h-4 w-4 mr-1 border-2 border-t-white border-white/30 rounded-full animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4 mr-1" />
                                )}
                                Save
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing && editData ? (
                      <div className="space-y-6">
                        {/* Editable Shipping Address */}
                        <div>
                          <h4 className="font-medium mb-3">Shipping Address</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Name"
                              value={editData.shipping_address?.name || ''}
                              onChange={(e) => updateEditData('shipping_address.name', e.target.value)}
                            />
                            <Input
                              placeholder="Email"
                              value={editData.shipping_address?.email || ''}
                              onChange={(e) => updateEditData('shipping_address.email', e.target.value)}
                            />
                            <Input
                              placeholder="Street Address"
                              value={editData.shipping_address?.street || ''}
                              onChange={(e) => updateEditData('shipping_address.street', e.target.value)}
                              className="col-span-2"
                            />
                            <Input
                              placeholder="City"
                              value={editData.shipping_address?.city || ''}
                              onChange={(e) => updateEditData('shipping_address.city', e.target.value)}
                            />
                            <Input
                              placeholder="State"
                              value={editData.shipping_address?.state || ''}
                              onChange={(e) => updateEditData('shipping_address.state', e.target.value)}
                            />
                            <Input
                              placeholder="Postal Code"
                              value={editData.shipping_address?.postalCode || ''}
                              onChange={(e) => updateEditData('shipping_address.postalCode', e.target.value)}
                            />
                            <Input
                              placeholder="Country"
                              value={editData.shipping_address?.country || ''}
                              onChange={(e) => updateEditData('shipping_address.country', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Editable Shipping Details */}
                        <div>
                          <h4 className="font-medium mb-3">Shipping Details</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Shipping Method"
                              value={editData.shipping_method || ''}
                              onChange={(e) => updateEditData('shipping_method', e.target.value)}
                            />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Shipping Cost"
                              value={editData.shipping_cost || 0}
                              onChange={(e) => updateEditData('shipping_cost', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        {/* Editable Order Items */}
                        <div>
                          <h4 className="font-medium mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {editData.order_items.map((item, index) => (
                              <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 border rounded">
                                <div className="col-span-5">
                                  <Input
                                    placeholder="Product Name"
                                    value={item.product_name || ''}
                                    onChange={(e) => updateOrderItem(index, 'product_name', e.target.value)}
                                  />
                                </div>
                                <div className="col-span-3">
                                  <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={item.quantity}
                                    onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                  />
                                </div>
                                <div className="col-span-4">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    value={item.price_at_purchase}
                                    onChange={(e) => updateOrderItem(index, 'price_at_purchase', parseFloat(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h4 className="font-medium">Items:</h4>
                        {order.order_items?.length ? (
                          order.order_items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.product_name || 'Unknown Product'} x {item.quantity}</span>
                              <span>${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No items found</p>
                        )}
                        {order.shipping_cost && order.shipping_cost > 0 && (
                          <div className="flex justify-between text-sm border-t pt-2">
                            <span>Shipping ({order.shipping_method || 'Standard'})</span>
                            <span>${order.shipping_cost.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

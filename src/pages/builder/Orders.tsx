
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Calendar, DollarSign, User, MapPin, CreditCard, Truck, Eye } from "lucide-react";
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

const Orders = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [id]);

  const fetchOrders = async () => {
    if (!id) return;
    
    try {
      // Fetch orders with their order items
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
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
    // Try to get customer info from various sources
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
          <p className="text-gray-600">Loading orders...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">View and manage all orders for your website</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600">Orders will appear here when customers make purchases</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const customerInfo = getCustomerInfo(order);
              
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
                                  Complete order information and management
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

                                  {/* Status Update */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">Update Order Status</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center gap-4">
                                        <Select 
                                          value={selectedOrder.status} 
                                          onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                                        >
                                          <SelectTrigger className="w-48">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <p className="text-sm text-gray-500">
                                          Last updated: {new Date(selectedOrder.updated_at).toLocaleString()}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
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

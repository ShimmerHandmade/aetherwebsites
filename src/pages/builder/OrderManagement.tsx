
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebsite } from "@/hooks/useWebsite";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Eye, Calendar, Box, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  website_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  shipping_address: any;
  billing_address: any;
  payment_info: any;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  product_name?: string;
  product_image?: string;
}

const OrderManagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { website, isLoading } = useWebsite(id, navigate);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all-orders");

  useEffect(() => {
    if (website) {
      fetchOrders();
    }
  }, [website, statusFilter]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      let query = supabase
        .from("orders")
        .select("*")
        .eq("website_id", id)
        .order("created_at", { ascending: false });
      
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } else {
        setOrders(data || []);
        console.log("Fetched orders:", data);
      }
    } catch (err) {
      console.error("Exception fetching orders:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    setLoadingOrderDetails(true);
    try {
      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);
      
      if (itemsError) {
        console.error("Error fetching order items:", itemsError);
        toast.error("Failed to load order details");
        return;
      }
      
      // Enhance order items with product details
      const enhancedItems: OrderItem[] = [];
      
      for (const item of itemsData || []) {
        // Fetch product name and image for each order item
        const { data: productData } = await supabase
          .from("products")
          .select("name, image_url")
          .eq("id", item.product_id)
          .single();
        
        enhancedItems.push({
          ...item,
          product_name: productData?.name || "Unknown Product",
          product_image: productData?.image_url || null,
        });
      }
      
      setOrderItems(enhancedItems);
    } catch (err) {
      console.error("Exception fetching order details:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
    setActiveTab("order-details");
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
    setOrderItems([]);
    setActiveTab("all-orders");
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      
      if (error) {
        console.error("Error updating order status:", error);
        toast.error("Failed to update order status");
      } else {
        toast.success(`Order status updated to ${newStatus}`);
        
        // Update the orders list
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        
        // Update selected order if it's the one being updated
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Exception updating order status:", err);
      toast.error("An unexpected error occurred");
    }
  };

  const handleBackToBuilder = () => {
    navigate(`/builder/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading website...</p>
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
            onClick={handleBackToBuilder}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Builder
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Order Management</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all-orders">All Orders</TabsTrigger>
              {selectedOrder && (
                <TabsTrigger value="order-details">Order Details</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="all-orders">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => fetchOrders()}
                  className="flex items-center gap-1"
                >
                  Refresh
                </Button>
              </div>
              
              {loadingOrders ? (
                <div className="text-center py-8">
                  <div className="h-10 w-10 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <Box className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No orders found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {statusFilter !== "all" 
                      ? `There are no orders with status "${statusFilter}".` 
                      : "No orders have been placed on this website yet."}
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              {formatDate(order.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>${Number(order.total_amount).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewOrder(order)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="order-details">
              {selectedOrder && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <Button 
                      variant="ghost" 
                      onClick={handleBackToOrders}
                      className="flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Orders
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Update Status:</span>
                      <Select 
                        value={selectedOrder.status} 
                        onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                        <CardDescription>
                          Items included in this order
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingOrderDetails ? (
                          <div className="text-center py-8">
                            <div className="h-10 w-10 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading order details...</p>
                          </div>
                        ) : orderItems.length === 0 ? (
                          <p className="text-gray-500 py-4">No items found for this order.</p>
                        ) : (
                          <div className="space-y-4">
                            {orderItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                                <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                  {item.product_image ? (
                                    <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                                  ) : (
                                    <Box className="h-8 w-8 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium">{item.product_name}</h4>
                                  <div className="flex justify-between mt-1">
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="font-medium">${Number(item.price_at_purchase).toFixed(2)} each</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <div className="border-t pt-4 flex justify-between items-center">
                              <span className="font-bold">Total:</span>
                              <span className="font-bold text-lg">${Number(selectedOrder.total_amount).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500">Order ID</p>
                              <p className="font-medium">{selectedOrder.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Status</p>
                              <p className="font-medium">{getStatusBadge(selectedOrder.status)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Last Updated</p>
                              <p className="font-medium">{formatDate(selectedOrder.updated_at)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {selectedOrder.shipping_address && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Shipping Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-1">
                              <p className="font-medium">{selectedOrder.shipping_address.name}</p>
                              <p>{selectedOrder.shipping_address.street}</p>
                              <p>
                                {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}
                              </p>
                              {selectedOrder.shipping_address.country && (
                                <p>{selectedOrder.shipping_address.country}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {selectedOrder.billing_address && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Billing Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-1">
                              <p className="font-medium">{selectedOrder.billing_address.name}</p>
                              <p>{selectedOrder.billing_address.street}</p>
                              <p>
                                {selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.zip}
                              </p>
                              {selectedOrder.billing_address.country && (
                                <p>{selectedOrder.billing_address.country}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;

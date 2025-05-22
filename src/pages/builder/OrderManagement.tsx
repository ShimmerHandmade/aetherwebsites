
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebsite } from "@/hooks/useWebsite";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Eye, Calendar, Box, Truck, Download } from "lucide-react";
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
  CardFooter,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  shipping_cost: number;
  shipping_method: string;
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
  product_image_url?: string;
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
  const [isExporting, setIsExporting] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [openSheet, setOpenSheet] = useState(false);

  useEffect(() => {
    if (website) {
      fetchOrders();
    }
  }, [website, statusFilter, dateFilter]);

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
      
      if (dateFilter === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte("created_at", today.toISOString());
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte("created_at", weekAgo.toISOString());
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte("created_at", monthAgo.toISOString());
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
      
      setOrderItems(itemsData || []);
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

  const handleOpenInvoice = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
    setOpenSheet(true);
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

  const handleExportOrders = async () => {
    setIsExporting(true);
    try {
      const orderData = orders.map(order => ({
        Order_ID: order.id,
        Date: new Date(order.created_at).toLocaleDateString(),
        Status: order.status,
        Customer: order.payment_info?.customer_info?.name || "Anonymous",
        Email: order.payment_info?.customer_info?.email || "N/A",
        Total: `$${Number(order.total_amount).toFixed(2)}`,
        Shipping: `$${Number(order.shipping_cost || 0).toFixed(2)}`,
        Payment_Method: order.payment_info?.method || "N/A",
        Shipping_Method: order.shipping_method || "N/A"
      }));
      
      // Create CSV content
      const headers = Object.keys(orderData[0]).join(",");
      const rows = orderData.map(order => Object.values(order).join(",")).join("\n");
      const csv = `${headers}\n${rows}`;
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Orders exported successfully");
    } catch (error) {
      console.error("Error exporting orders:", error);
      toast.error("Failed to export orders");
    } finally {
      setIsExporting(false);
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
      case 'awaiting_payment':
        return <Badge className="bg-orange-500">Awaiting Payment</Badge>;
      case 'payment_failed':
        return <Badge className="bg-red-500">Payment Failed</Badge>;
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

  // Calculate order statistics
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const pendingOrdersCount = orders.filter(order => order.status.toLowerCase() === 'pending').length;

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
          
          {activeTab === "all-orders" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrdersCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrdersCount}</div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all-orders">All Orders</TabsTrigger>
              {selectedOrder && (
                <TabsTrigger value="order-details">Order Details</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="all-orders">
              <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
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
                      <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
                      <SelectItem value="payment_failed">Payment Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={dateFilter} 
                    onValueChange={setDateFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleExportOrders}
                    disabled={isExporting || orders.length === 0}
                    className="flex items-center gap-1"
                  >
                    {isExporting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Export
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fetchOrders()}
                    className="flex items-center gap-1"
                  >
                    Refresh
                  </Button>
                </div>
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
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Shipping</TableHead>
                          <TableHead>Total</TableHead>
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
                            <TableCell>{order.payment_info?.customer_info?.name || "Anonymous"}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              {order.shipping_method ? (
                                <div className="flex items-center gap-1">
                                  <Truck className="h-4 w-4 text-gray-500" />
                                  <span className="capitalize">{order.shipping_method.replace('_', ' ')}</span>
                                </div>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell>${Number(order.total_amount).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleOpenInvoice(order)}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleViewOrder(order)}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Order Items</CardTitle>
                          <CardDescription>
                            Items included in this order
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenInvoice(selectedOrder)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Invoice
                        </Button>
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
                                  {item.product_image_url ? (
                                    <img src={item.product_image_url} alt={item.product_name} className="h-full w-full object-cover" />
                                  ) : (
                                    <Box className="h-8 w-8 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium">{item.product_name || "Product"}</h4>
                                  <div className="flex justify-between mt-1">
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="font-medium">${Number(item.price_at_purchase).toFixed(2)} each</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span>${(Number(selectedOrder.total_amount) - Number(selectedOrder.shipping_cost || 0)).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-muted-foreground">Shipping ({selectedOrder.shipping_method?.replace('_', ' ') || 'Standard'}):</span>
                                <span>${Number(selectedOrder.shipping_cost || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                <span className="font-bold">Total:</span>
                                <span className="font-bold text-lg">${Number(selectedOrder.total_amount).toFixed(2)}</span>
                              </div>
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
                              <p className="text-sm text-gray-500">Payment Method</p>
                              <p className="font-medium capitalize">{selectedOrder.payment_info?.method?.replace('_', ' ') || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Last Updated</p>
                              <p className="font-medium">{formatDate(selectedOrder.updated_at)}</p>
                            </div>
                            {selectedOrder.payment_info?.notes && (
                              <div>
                                <p className="text-sm text-gray-500">Order Notes</p>
                                <p className="font-medium">{selectedOrder.payment_info.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedOrder.payment_info?.customer_info?.name && (
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{selectedOrder.payment_info.customer_info.name}</p>
                              </div>
                            )}
                            {selectedOrder.payment_info?.customer_info?.email && (
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{selectedOrder.payment_info.customer_info.email}</p>
                              </div>
                            )}
                            {selectedOrder.payment_info?.customer_info?.phone && (
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{selectedOrder.payment_info.customer_info.phone}</p>
                              </div>
                            )}
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
                                {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}
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
                                {selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.postalCode}
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
      
      {/* Invoice Preview Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="w-[90vw] sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Invoice</SheetTitle>
            <SheetDescription>
              Order #{selectedOrder?.id?.slice(0, 8)}
            </SheetDescription>
          </SheetHeader>
          
          {selectedOrder && (
            <div className="py-6" id="invoice-content">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{website?.name || "Store"}</h2>
                  <p className="text-gray-500 text-sm">Invoice #{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Date</p>
                  <p>{formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-medium mb-2">Bill To:</h3>
                  {selectedOrder.billing_address ? (
                    <div className="text-sm">
                      <p>{selectedOrder.billing_address.name}</p>
                      <p>{selectedOrder.billing_address.street}</p>
                      <p>
                        {selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.postalCode}
                      </p>
                      {selectedOrder.billing_address.country && (
                        <p>{selectedOrder.billing_address.country}</p>
                      )}
                    </div>
                  ) : selectedOrder.payment_info?.customer_info ? (
                    <div className="text-sm">
                      <p>{selectedOrder.payment_info.customer_info.name || "N/A"}</p>
                      <p>{selectedOrder.payment_info.customer_info.email || "N/A"}</p>
                      <p>{selectedOrder.payment_info.customer_info.phone || "N/A"}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No billing information</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Ship To:</h3>
                  {selectedOrder.shipping_address ? (
                    <div className="text-sm">
                      <p>{selectedOrder.shipping_address.name}</p>
                      <p>{selectedOrder.shipping_address.street}</p>
                      <p>
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}
                      </p>
                      {selectedOrder.shipping_address.country && (
                        <p>{selectedOrder.shipping_address.country}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No shipping information</p>
                  )}
                </div>
              </div>
              
              <table className="min-w-full border-collapse border mb-8">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left">Item</th>
                    <th className="border p-3 text-center">Qty</th>
                    <th className="border p-3 text-right">Price</th>
                    <th className="border p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-3">{item.product_name}</td>
                      <td className="border p-3 text-center">{item.quantity}</td>
                      <td className="border p-3 text-right">${Number(item.price_at_purchase).toFixed(2)}</td>
                      <td className="border p-3 text-right">${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border p-3" colSpan={2}></td>
                    <td className="border p-3 text-right font-medium">Subtotal</td>
                    <td className="border p-3 text-right">${(Number(selectedOrder.total_amount) - Number(selectedOrder.shipping_cost || 0)).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="border p-3" colSpan={2}></td>
                    <td className="border p-3 text-right font-medium">Shipping</td>
                    <td className="border p-3 text-right">${Number(selectedOrder.shipping_cost || 0).toFixed(2)}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-3" colSpan={2}></td>
                    <td className="border p-3 text-right font-bold">Total</td>
                    <td className="border p-3 text-right font-bold">${Number(selectedOrder.total_amount).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              
              <div className="mb-8">
                <h3 className="font-medium mb-2">Payment Information:</h3>
                <p className="text-sm">Payment Method: <span className="capitalize">{selectedOrder.payment_info?.method?.replace('_', ' ') || "N/A"}</span></p>
                <p className="text-sm">Status: <span>{selectedOrder.status}</span></p>
                {selectedOrder.payment_info?.notes && (
                  <p className="text-sm mt-2">Notes: {selectedOrder.payment_info.notes}</p>
                )}
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button onClick={() => window.print()}>Print Invoice</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrderManagement;

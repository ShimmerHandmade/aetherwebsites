
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, ShoppingBag, Loader2 } from 'lucide-react';
import { useOrderManager } from '@/hooks/useOrderManager';

interface OrderManagerProps {
  websiteId?: string;
  onBackToBuilder?: () => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({ websiteId, onBackToBuilder }) => {
  const { id: websiteIdParam } = useParams<{ id: string }>();
  const effectiveWebsiteId = websiteId || websiteIdParam;
  
  const {
    orders,
    loading,
    error,
    editingOrder,
    setEditingOrder,
    handleEdit,
    handleCancel,
    handleSave,
    isSaving,
    saveStatus,
    hasUnsavedChanges
  } = useOrderManager(effectiveWebsiteId);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Orders</h3>
          <p className="text-gray-600">Fetching order data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBackToBuilder && (
              <Button variant="outline" size="sm" onClick={onBackToBuilder}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Order Manager</h1>
            </div>
            
            {saveStatus && (
              <span className={`text-sm ${
                hasUnsavedChanges ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {saveStatus}
              </span>
            )}
          </div>

          {editingOrder && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {editingOrder ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Order #{editingOrder.id.slice(0, 8)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingOrder.status}
                    onValueChange={(value) => setEditingOrder({ ...editingOrder, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                <div>
                  <Label htmlFor="shipping_method">Shipping Method</Label>
                  <Input
                    id="shipping_method"
                    value={editingOrder.shipping_method || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, shipping_method: e.target.value })}
                    placeholder="Standard Shipping"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="shipping_cost">Shipping Cost</Label>
                <Input
                  id="shipping_cost"
                  type="number"
                  step="0.01"
                  value={editingOrder.shipping_cost || 0}
                  onChange={(e) => setEditingOrder({ ...editingOrder, shipping_cost: parseFloat(e.target.value) })}
                />
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-2">
                  {editingOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{item.product_name} x{item.quantity}</span>
                      <span>${item.price_at_purchase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600">Orders will appear here when customers make purchases.</p>
              </div>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleEdit(order)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {order.order_items?.length || 0} item(s)
                      </span>
                      <span className="font-medium">${order.total_amount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;

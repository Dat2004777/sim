import { useState, useEffect } from "react";
import { orderService } from "../services/orderService";
import { productService } from "../services/productService";
import {
  Search,
  Plus,
  ReceiptText,
  Boxes,
  Calendar,
  CreditCard,
  Banknote,
  BadgeCent,
  Loader2,
  Trash2,
  Package,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 1. Header & Thanh tìm kiếm
function OrderHeader({ searchTerm, onSearchChange, totalCount }) {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-slate-100 px-4 pt-5 pb-3">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Bán hàng
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
            <ReceiptText className="w-5 h-5 text-blue-600" /> Lịch Sử Đơn Hàng
          </h1>
        </div>
        <Badge variant="secondary" className="px-2.5 py-1 text-xs font-bold">
          {totalCount} Đơn
        </Badge>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Tìm theo sản phẩm hoặc phương thức..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-slate-100/80 border-none rounded-xl text-base h-10 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white"
        />
      </div>
    </header>
  );
}

// 2. Thẻ hiển thị từng đơn hàng (Bỏ ID, hiển thị rõ cả ngày tháng năm)
function OrderCard({ order, onClick }) {
  const formattedDate = new Date(order.createdAt).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      onClick={() => onClick(order)}
      className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm active:scale-[0.99] transition duration-150 relative overflow-hidden cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-bold text-slate-600 bg-slate-50 border-slate-200 flex items-center gap-1"
        >
          {order.paymentMethod === "Tiền mặt" ? (
            <Banknote className="w-3 h-3 text-emerald-600" />
          ) : (
            <CreditCard className="w-3 h-3 text-blue-600" />
          )}
          {order.paymentMethod}
        </Badge>
      </div>

      <div className="text-sm font-semibold text-slate-800 py-1.5 border-t border-slate-100 line-clamp-2">
        {order.items
          ?.map((i) => `${i.productName} (x${i.quantity})`)
          .join(", ")}
      </div>

      <div className="flex justify-between items-end pt-2 mt-1 border-t border-dashed border-slate-100">
        <div>
          <p className="text-[11px] text-slate-400">Lãi ước tính</p>
          <span className="text-xs text-emerald-600 font-bold">
            +{Number(order.profit).toLocaleString("vi-VN")}đ
          </span>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400">Tổng tiền</p>
          <span className="text-base font-extrabold text-blue-600">
            {Number(order.totalAmount).toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>
    </div>
  );
}

// 3. Trạng thái Loading & Trống (Empty)
function OrderListStatus({ loading, isEmpty }) {
  if (loading) {
    return (
      <div className="text-center py-16 space-y-2">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">
          Đang tải lịch sử đơn...
        </p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-16 space-y-1">
        <Boxes className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-500">
          Chưa có đơn hàng nào
        </p>
        <p className="text-xs text-slate-400">
          Bấm dấu (+) bên dưới để tạo đơn bán hàng
        </p>
      </div>
    );
  }

  return null;
}

// 4. Modal xem chi tiết đơn hàng
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Dialog open={Boolean(order)} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-t-3xl sm:rounded-2xl p-5 border-none">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 space-y-0">
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <ReceiptText className="w-5 h-5 text-blue-600" /> Chi Tiết Đơn Hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Thời gian tạo:
            </span>
            <span className="font-semibold text-slate-700">
              {formattedDate}
            </span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase">
              Danh sách mặt hàng
            </Label>
            <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto border border-slate-100 rounded-xl px-3 bg-white">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2.5 flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.productName}
                    </p>
                    <p className="text-xs text-slate-400">
                      Số lượng: {item.quantity} •{" "}
                      {Number(item.sellingPrice).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <span className="font-bold text-slate-700">
                    {(
                      Number(item.sellingPrice) * Number(item.quantity)
                    ).toLocaleString("vi-VN")}
                    đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Hình thức:</span>
              <span className="font-semibold text-slate-700">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tiền vốn:</span>
              <span>{Number(order.totalCost).toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Lợi nhuận ròng:</span>
              <span className="font-semibold text-emerald-600">
                +{Number(order.profit).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
              <span>Tổng thanh toán:</span>
              <span className="text-blue-600 font-black">
                {Number(order.totalAmount).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 5. Modal Tạo đơn hàng mới
function CreateOrderModal({ isOpen, products, onClose, onSubmit }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [cartItems, setCartItems] = useState([]);

  const handleAddItem = () => {
    const prod = products.find(
      (p) => String(p.id) === String(selectedProductId),
    );
    if (!prod) return;

    const existingIndex = cartItems.findIndex((item) => item.id === prod.id);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += Number(quantity);
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: prod.id,
          productName: prod.name,
          costPrice: prod.costPrice,
          sellingPrice: prod.sellingPrice,
          quantity: Number(quantity),
        },
      ]);
    }
    setSelectedProductId("");
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const totalAmount = cartItems.reduce(
    (acc, cur) => acc + cur.sellingPrice * cur.quantity,
    0,
  );
  const totalCost = cartItems.reduce(
    (acc, cur) => acc + cur.costPrice * cur.quantity,
    0,
  );
  const totalProfit = totalAmount - totalCost;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm!");
      return;
    }

    onSubmit({
      createdAt: new Date().toISOString(),
      paymentMethod,
      totalAmount,
      totalCost,
      profit: totalProfit,
      items: cartItems,
    });

    setCartItems([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-t-3xl sm:rounded-2xl p-5 border-none max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 space-y-0">
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <Plus className="w-5 h-5 text-blue-600" /> Tạo Đơn Hàng Mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          {/* Chọn sản phẩm */}
          <div className="p-3 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
            <Label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> Thêm mặt hàng
            </Label>
            <div className="space-y-2">
              <Select
                value={selectedProductId}
                onValueChange={(val) => setSelectedProductId(val)}
              >
                <SelectTrigger className="w-full rounded-xl text-base bg-white border-slate-200 focus:ring-blue-500">
                  <SelectValue placeholder="-- Chọn sản phẩm trong kho --">
                    {/* Tự render tên sản phẩm nếu Radix không bắt được text */}
                    {selectedProductId
                      ? products.find(
                          (p) => String(p.id) === String(selectedProductId),
                        )?.name
                      : undefined}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent className="rounded-xl">
                  {products.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      <span className="font-medium text-slate-800">
                        {p.name}
                      </span>
                      <span className="text-slate-400 text-xs ml-2">
                        ({Number(p.sellingPrice).toLocaleString("vi-VN")}đ)
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="SL"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-24 rounded-xl text-base bg-white border-slate-200 text-center font-bold"
                />
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedProductId}
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold py-2.5 transition"
                >
                  + Thêm vào đơn
                </Button>
              </div>
            </div>
          </div>

          {/* Giỏ hàng đơn */}
          {cartItems.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Mặt hàng đã chọn ({cartItems.length})
              </Label>
              <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto border border-slate-100 rounded-xl px-3 bg-white">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-2 flex justify-between items-center text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        {item.productName}
                      </p>
                      <p className="text-slate-400">
                        x{item.quantity} •{" "}
                        {(item.sellingPrice * item.quantity).toLocaleString(
                          "vi-VN",
                        )}
                        đ
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(idx)}
                      className="h-7 w-7 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phương thức thanh toán */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-600 uppercase">
              Phương thức thanh toán
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {["Tiền mặt", "Chuyển khoản QR"].map((method) => (
                <Button
                  type="button"
                  key={method}
                  variant={paymentMethod === method ? "default" : "outline"}
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-xl text-xs font-bold py-3 ${
                    paymentMethod === method
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="p-3.5 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
            <div>
              <span className="text-xs text-slate-500">Tổng thanh toán:</span>
              <p className="text-xs text-emerald-600 font-semibold">
                Lãi ước tính: +{totalProfit.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <span className="text-lg font-black text-blue-600">
              {totalAmount.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <Button
            type="submit"
            disabled={cartItems.length === 0}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
          >
            Chốt Đơn Hàng
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 6. Component Container chính (Điều phối state)
export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [orderData, productData] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts(),
      ]);
      setOrders(orderData || []);
      setProducts(
        Array.isArray(productData) ? productData : productData?.data || [],
      );
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrder = async (orderPayload) => {
    const newOrder = {
      ...orderPayload,
      id: Date.now(),
    };
    setOrders([newOrder, ...orders]);
  };

  const filteredOrders = orders.filter((order) => {
    const matchMethod = order.paymentMethod
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchProduct = order.items?.some((i) =>
      i.productName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return matchMethod || matchProduct;
  });

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <OrderHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalCount={filteredOrders.length}
      />

      {/* Danh sách */}
      <main className="p-4 space-y-3 flex-1 overflow-y-auto mb-20">
        <OrderListStatus
          loading={loading}
          isEmpty={!loading && filteredOrders.length === 0}
        />
        {!loading &&
          filteredOrders.map((order, idx) => (
            <OrderCard
              key={order.id || idx}
              order={order}
              onClick={setSelectedOrder}
            />
          ))}
      </main>

      {/* Nút FAB (+) */}
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-24 right-6 md:right-[calc(50%-210px)] w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-500/30 p-0 flex items-center justify-center z-30 transition"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Modal Chi tiết đơn */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* Modal Tạo đơn */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        products={products}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
}

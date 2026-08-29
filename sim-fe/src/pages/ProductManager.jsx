import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import {
  Search,
  Plus,
  Package,
  Boxes,
  Tag,
  BadgeCent,
  Layers,
  Loader2,
  X,
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
import { toast } from "sonner";

const INITIAL_FORM_STATE = {
  name: "",
  category: "Chung",
  costPrice: 0,
  sellingPrice: 0,
  stockQuantity: 0,
  unit: "Cái",
  isActive: true,
};

// 1. Header & Thanh tìm kiếm
function ProductHeader({ searchTerm, onSearchChange, totalCount }) {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-slate-100 px-4 pt-5 pb-3">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Kho hàng
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
            <Package className="w-5 h-5 text-blue-600" /> Danh Sách Sản Phẩm
          </h1>
        </div>
        <Badge variant="secondary" className="px-2.5 py-1 text-xs font-bold">
          {totalCount} SP
        </Badge>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc danh mục..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-slate-100/80 border-none rounded-xl text-base h-10 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white"
        />
      </div>
    </header>
  );
}

// 2. Thẻ hiển thị từng sản phẩm
function ProductCard({ product, onClick }) {
  const isHighStock = product.stockQuantity >= 3;

  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm active:scale-[0.99] transition duration-150 relative overflow-hidden cursor-pointer"
    >
      <div
        className={`absolute top-0 left-0 bottom-0 w-1.5 ${
          isHighStock ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      <div className="pl-1">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <div>
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-bold text-slate-600 bg-slate-50 border-slate-200"
            >
              {product.category || "Chung"}
            </Badge>
            <h2 className="text-base font-bold text-slate-800 mt-1 line-clamp-1 leading-snug">
              {product.name}
            </h2>
          </div>
          <Badge
            className={`text-xs font-bold px-2.5 py-1 rounded-full border-none whitespace-nowrap ${
              isHighStock
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                : "bg-rose-50 text-rose-700 hover:bg-rose-50"
            }`}
          >
            Tồn: {product.stockQuantity} {product.unit}
          </Badge>
        </div>

        <div className="flex justify-between items-end mt-3 pt-2.5 border-t border-dashed border-slate-100">
          <div>
            <p className="text-[11px] text-slate-400">Giá vốn</p>
            <p className="text-xs font-semibold text-slate-600">
              {Number(product.costPrice).toLocaleString("vi-VN")}đ
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400">Giá bán</p>
            <p className="text-base font-extrabold text-blue-600">
              {Number(product.sellingPrice).toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Trạng thái Loading & Trống (Empty)
function ProductListStatus({ loading, isEmpty }) {
  if (loading) {
    return (
      <div className="text-center py-16 space-y-2">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">
          Đang tải danh sách...
        </p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-16 space-y-1">
        <Boxes className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-500">
          Không tìm thấy sản phẩm nào
        </p>
        <p className="text-xs text-slate-400">
          Bấm dấu (+) bên dưới để thêm mới
        </p>
      </div>
    );
  }

  return null;
}

// 4. Modal/Dialog Form thêm & sửa
function ProductFormModal({
  isOpen,
  isEditing,
  formData,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-t-3xl sm:rounded-2xl p-5 border-none">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 space-y-0">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {isEditing ? "Cập Nhật Sản Phẩm" : "Thêm Mới Sản Phẩm"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tên sản phẩm *
            </Label>
            <Input
              type="text"
              placeholder="Nhập tên sản phẩm"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="rounded-xl text-base bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Danh mục
            </Label>
            <Select
              value={formData.category || "Chung"}
              onValueChange={(value) => onChange("category", value)}
            >
              <SelectTrigger className="w-full rounded-xl text-base bg-slate-50 border-slate-200 focus:ring-blue-500">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Chung">Chung</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                <BadgeCent className="w-3.5 h-3.5" /> Giá vốn (VNĐ)
              </Label>
              <Input
                type="text"
                min="0"
                value={formData.costPrice}
                onChange={(e) => onChange("costPrice", Number(e.target.value))}
                className="rounded-xl text-base bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                <BadgeCent className="w-3.5 h-3.5 text-blue-600" /> Giá bán
                (VNĐ) *
              </Label>
              <Input
                type="text"
                min="0"
                value={formData.sellingPrice}
                onChange={(e) =>
                  onChange("sellingPrice", Number(e.target.value))
                }
                className="rounded-xl text-base bg-slate-50 border-slate-200 focus-visible:ring-blue-500 font-bold text-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                <Boxes className="w-3.5 h-3.5" /> Số lượng tồn
              </Label>
              <Input
                type="text"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) =>
                  onChange("stockQuantity", Number(e.target.value))
                }
                className="rounded-xl text-base bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600 uppercase">
                Đơn vị tính
              </Label>
              <Input
                type="text"
                value={formData.unit}
                onChange={(e) => onChange("unit", e.target.value)}
                className="rounded-xl text-base bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
            >
              {isEditing ? "Lưu Thay Đổi" : "Thêm Vào Kho"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 5. Component Container chính (Điều phối state)
export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts();
      setProducts(Array.isArray(response) ? response : response?.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        category: product.category || "",
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        stockQuantity: product.stockQuantity,
        unit: product.unit || "Cái",
      });
    } else {
      setEditingId(null);
      setFormData(INITIAL_FORM_STATE);
    }
    setIsModalOpen(true);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate Tên sản phẩm
    if (!formData.name || !formData.name.trim()) {
      toast.warning("Vui lòng nhập tên sản phẩm!");
      return;
    }

    // 2. Validate Giá vốn và Giá bán
    if (formData.costPrice < 0 || formData.sellingPrice < 0) {
      toast.warning("Giá vốn và giá bán không được là số âm!");
      return;
    }

    if (Number(formData.sellingPrice) === 0) {
      toast.warning("Giá bán phải lớn hơn 0đ!");
      return;
    }

    if (Number(formData.sellingPrice) < Number(formData.costPrice)) {
      toast.warning("Cảnh báo: Giá bán đang thấp hơn giá vốn!");
    }

    // 3. Validate Số lượng tồn kho
    if (formData.stockQuantity < 0) {
      toast.warning("Số lượng tồn kho không được nhỏ hơn 0!");
      return;
    }

    // 4. Validate Đơn vị tính
    if (!formData.unit || !formData.unit.trim()) {
      toast.warning("Vui lòng nhập đơn vị tính!");
      return;
    }

    // 5. Gửi request và hiển thị toast kết quả
    try {
      if (editingId) {
        await productService.updateProduct(editingId, formData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(formData);
        toast.success("Thêm mới sản phẩm thành công!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(
        "Lỗi lưu sản phẩm: " + (error.response?.data?.message || error.message),
      );
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <ProductHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalCount={filteredProducts.length}
      />

      {/* Danh sách */}
      <main className="p-4 space-y-3 flex-1 overflow-y-auto mb-20">
        <ProductListStatus
          loading={loading}
          isEmpty={!loading && filteredProducts.length === 0}
        />
        {!loading &&
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={handleOpenModal}
            />
          ))}
      </main>

      {/* Nút FAB */}
      <Button
        onClick={() => handleOpenModal()}
        className="fixed bottom-24 right-6 md:right-[calc(50%-210px)] w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-500/30 p-0 flex items-center justify-center z-30 transition"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Modal Dialog */}
      <ProductFormModal
        isOpen={isModalOpen}
        isEditing={Boolean(editingId)}
        formData={formData}
        onChange={handleFieldChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

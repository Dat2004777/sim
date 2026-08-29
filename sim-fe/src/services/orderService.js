// Dữ liệu mẫu giả lập Database
let mockOrders = [
  {
    id: 1001,
    createdAt: "2026-08-27T08:30:00",
    paymentMethod: "Chuyển khoản QR",
    totalAmount: 380000,
    totalCost: 260000,
    profit: 120000,
    items: [
      { id: 1, productName: "Chổi lau nhà", quantity: 2, sellingPrice: 150000, costPrice: 100000 },
      { id: 2, productName: "Bàn chải đánh răng", quantity: 1, sellingPrice: 80000, costPrice: 60000 }
    ]
  },
  {
    id: 1002,
    createdAt: "2026-08-27T10:15:00",
    paymentMethod: "Tiền mặt",
    totalAmount: 180000,
    totalCost: 120000,
    profit: 60000,
    items: [
      { id: 3, productName: "Chổi lau nhà", quantity: 1, sellingPrice: 180000, costPrice: 120000 }
    ]
  },
  {
    id: 1003,
    createdAt: "2026-08-26T15:45:00",
    paymentMethod: "Chuyển khoản QR",
    totalAmount: 450000,
    totalCost: 310000,
    profit: 140000,
    items: [
      { id: 1, productName: "Bàn chải đánh răng", quantity: 3, sellingPrice: 150000, costPrice: 100000 }
    ]
  },
  {
    id: 1004,
    createdAt: "2026-08-25T14:20:00",
    paymentMethod: "Tiền mặt",
    totalAmount: 250000,
    totalCost: 180000,
    profit: 70000,
    items: [
      { id: 4, productName: "Nồi cơm điện", quantity: 1, sellingPrice: 250000, costPrice: 180000 }
    ]
  }
];

export const orderService = {
  // Lấy toàn bộ danh sách đơn hàng
  getAllOrders: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockOrders]), 200);
    });
  },

  // Lấy dữ liệu thống kê tổng hợp
  getAnalytics: async () => {
    return new Promise((resolve) => {
      const todayStr = "2026-08-27";
      
      const totalRevenue = mockOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const totalProfit = mockOrders.reduce((acc, curr) => acc + curr.profit, 0);
      const totalOrdersCount = mockOrders.length;

      const todayOrders = mockOrders.filter(o => o.createdAt.startsWith(todayStr));
      const todayRevenue = todayOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const todayProfit = todayOrders.reduce((acc, curr) => acc + curr.profit, 0);

      // Thống kê top sản phẩm bán chạy
      const productSales = {};
      mockOrders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productName]) {
            productSales[item.productName] = { quantity: 0, revenue: 0 };
          }
          productSales[item.productName].quantity += item.quantity;
          productSales[item.productName].revenue += item.quantity * item.sellingPrice;
        });
      });

      const topProducts = Object.entries(productSales)
        .map(([name, stat]) => ({ name, ...stat }))
        .sort((a, b) => b.quantity - a.quantity);

      setTimeout(() => {
        resolve({
          todayRevenue,
          todayProfit,
          todayOrdersCount: todayOrders.length,
          totalRevenue,
          totalProfit,
          totalOrdersCount,
          topProducts
        });
      }, 200);
    });
  }
};
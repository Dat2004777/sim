import { useState, useEffect } from "react";
import { orderService } from "../services/orderService";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock dữ liệu cho 3 biểu đồ (sẽ nối API sau)
  const hourlyRevenueData = [
    { time: "08h", revenue: 150000 },
    { time: "10h", revenue: 380000 },
    { time: "12h", revenue: 220000 },
    { time: "14h", revenue: 450000 },
    { time: "16h", revenue: 290000 },
    { time: "18h", revenue: 600000 },
    { time: "20h", revenue: 410000 },
  ];

  const weeklyTrendData = [
    { day: "T2", doanhThu: 1200000, loiNhuan: 400000 },
    { day: "T3", doanhThu: 950000, loiNhuan: 310000 },
    { day: "T4", doanhThu: 1400000, loiNhuan: 520000 },
    { day: "T5", doanhThu: 1100000, loiNhuan: 380000 },
    { day: "T6", doanhThu: 1800000, loiNhuan: 650000 },
    { day: "T7", doanhThu: 2300000, loiNhuan: 890000 },
    { day: "CN", doanhThu: 2100000, loiNhuan: 780000 },
  ];

  const categoryShareData = [
    { name: "SIM Data 4G", value: 55, color: "#2563eb" },
    { name: "Thẻ cào", value: 25, color: "#10b981" },
    { name: "SIM Phong thủy", value: 12, color: "#f59e0b" },
    { name: "Khác", value: 8, color: "#8b5cf6" },
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await orderService.getAnalytics();
        setData(res);
      } catch (error) {
        console.error("Lỗi khi tải báo cáo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-slate-100 px-4 pt-5 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Thống kê</span>
        <h1 className="text-xl font-extrabold text-slate-900">Báo Cáo Doanh Thu</h1>
      </header>

      <main className="p-4 space-y-4 flex-1 overflow-y-auto mb-20">
        {loading || !data ? (
          <div className="text-center py-16 text-xs text-slate-400 font-medium">Đang tính toán số liệu...</div>
        ) : (
          <>
            {/* Thẻ doanh thu hôm nay */}
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white">
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">Doanh thu hôm nay</span>
              <h2 className="text-2xl font-black mt-1">
                {data.todayRevenue.toLocaleString("vi-VN")}đ
              </h2>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
                <div>
                  <span className="opacity-75">Lãi ước tính</span>
                  <p className="font-bold text-sm text-emerald-300">+{data.todayProfit.toLocaleString("vi-VN")}đ</p>
                </div>
                <div className="text-right">
                  <span className="opacity-75">Số đơn chốt</span>
                  <p className="font-bold text-sm">{data.todayOrdersCount} đơn</p>
                </div>
              </div>
            </div>

            {/* Thẻ tổng kết */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                <span className="text-[11px] text-slate-500 font-medium">Tổng doanh thu</span>
                <p className="text-base font-extrabold text-slate-800 mt-1">
                  {data.totalRevenue.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5">
                <span className="text-[11px] text-emerald-700 font-medium">Tổng lợi nhuận</span>
                <p className="text-base font-extrabold text-emerald-600 mt-1">
                  +{data.totalProfit.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>

            {/* Bảng Top sản phẩm bán chạy */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Top Sản Phẩm Bán Chạy</h3>
              <div className="divide-y divide-slate-100">
                {data.topProducts.map((p, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-slate-400">Đã bán: {p.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700">
                      {p.revenue.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1. LineGraph: Doanh thu theo khung giờ */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800">Biến Động Doanh Thu Hôm Nay</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase">Theo Giờ</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyRevenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" tickFormatter={(val) => `${val / 1000}k`} />
                    <Tooltip
                      formatter={(val) => [`${Number(val).toLocaleString("vi-VN")}đ`, "Doanh thu"]}
                      contentStyle={{ borderRadius: "12px", fontSize: "11px", border: "1px solid #e2e8f0" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. BarChart: Doanh thu & Lợi nhuận 7 ngày gần nhất */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800">Hiệu Quả Kinh Doanh 7 Ngày</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 uppercase">Tuần Này</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" tickFormatter={(val) => `${val / 1000000}Tr`} />
                    <Tooltip
                      formatter={(val) => `${Number(val).toLocaleString("vi-VN")}đ`}
                      contentStyle={{ borderRadius: "12px", fontSize: "11px", border: "1px solid #e2e8f0" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="doanhThu" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="loiNhuan" name="Lợi nhuận" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. PieChart: Tỷ trọng danh mục sản phẩm */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Tỷ Trọng Doanh Thu Theo Loại</h3>
              <div className="h-48 w-full flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryShareData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${val}%`, "Tỷ trọng"]}
                      contentStyle={{ borderRadius: "12px", fontSize: "11px", border: "1px solid #e2e8f0" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Chú thích màu sắc cho Pie Chart */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                {categoryShareData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium truncate">{item.name}</span>
                    <span className="text-slate-400 font-bold ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
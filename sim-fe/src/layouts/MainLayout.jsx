import { Outlet } from "react-router";
import BottomNav from "../components/BottomNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-blue-500 selection:text-white">
      {/* Khung điện thoại trung tâm */}
      <div className="w-full max-w-md bg-white min-h-screen relative flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
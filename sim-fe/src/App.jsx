import { Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import ProductManager from "./pages/ProductManager";
import OrderHistory from "./pages/OrderHistory";
import Analytics from "./pages/Analytics";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Analytics />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/products" element={<ProductManager />} />
        </Route>
      </Routes>

      <Toaster richColors position="top-center" />
    </>
  );
};

export default App;

import { useEffect } from "react";
import { productService } from "@/services/productService.js";

const Home = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await productService.getAllProducts();
      console.log(data);
    };
    fetchData();
  }, []);

  return <div>Home</div>;
};

export default Home;

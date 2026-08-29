import api from "@/lib/axios";

export const productService = {
    getAllProducts: async () => {
        const res = await api.get("/products");
        return res.data;
    },
    getProductById: async (id) => {
        const res = await api.get(`/products/${id}`);
        return res.data;
    },
    createProduct: async (data) => {
        const res = await api.post("/products", data);
        return res.data;
    },
    updateProduct: async (id, data) => {
        const res = await api.put(`/products/${id}`, data);
        return res.data;
    },
    deleteProduct: async (id) => {
        const res = await api.delete(`/products/${id}`);
        return res.data;
    }
}
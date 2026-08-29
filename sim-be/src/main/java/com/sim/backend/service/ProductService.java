package com.sim.backend.service;

import java.util.List;

import com.sim.backend.dto.request.CreateProductRequest;
import com.sim.backend.model.Product;

public interface ProductService {
    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product createProduct(CreateProductRequest request);

    Product updateProduct(Long id, CreateProductRequest request);

    Product deleteProduct(Long id);
}

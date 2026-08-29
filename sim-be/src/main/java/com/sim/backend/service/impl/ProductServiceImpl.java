package com.sim.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sim.backend.dto.request.CreateProductRequest;
import com.sim.backend.model.Product;
import com.sim.backend.repository.ProductRepository;
import com.sim.backend.service.ProductService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public Product createProduct(CreateProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .category(request.getCategory())
                .costPrice(request.getCostPrice() != null ? request.getCostPrice() : 0L)
                .sellingPrice(request.getSellingPrice())
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                .unit(request.getUnit() != null ? request.getUnit() : "Cái")
                .isActive(true)
                .build();

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product deleteProduct(Long id) {
        Product existing = getProductById(id);
        existing.setIsActive(false);
        return productRepository.save(existing);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .filter(Product::getIsActive)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có ID: " + id));
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, CreateProductRequest request) {
        Product existing = getProductById(id);

        existing.setName(request.getName());
        existing.setCategory(request.getCategory());
        existing.setCostPrice(request.getCostPrice());
        existing.setSellingPrice(request.getSellingPrice());
        existing.setStockQuantity(request.getStockQuantity());
        existing.setUnit(request.getUnit());

        return productRepository.save(existing);
    }

}

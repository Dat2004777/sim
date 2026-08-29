package com.sim.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String category;

    @Min(value = 0, message = "Giá vốn không được nhỏ hơn 0")
    private Long costPrice = 0L;

    @NotNull(message = "Giá bán không được để trống")
    @Min(value = 0, message = "Giá bán không được nhỏ hơn 0")
    private Long sellingPrice;

    @Min(value = 0, message = "Số lượng tồn không được nhỏ hơn 0")
    private Integer stockQuantity = 0;

    private String unit = "Cái";
}

package com.zeydem.controller;

import com.zeydem.dto.ProductDetailResponse;
import com.zeydem.dto.ProductResponse;
import com.zeydem.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/products")
    public List<ProductResponse> listProducts() {
        return productService.listProducts();
    }

    @GetMapping("/products/{slug}")
    public ProductDetailResponse getProduct(@PathVariable String slug) {
        return productService.getProduct(slug);
    }
}

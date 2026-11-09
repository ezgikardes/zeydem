package com.zeydem.service;

import com.zeydem.domain.Product;
import com.zeydem.dto.ProductDetailResponse;
import com.zeydem.dto.ProductResponse;
import com.zeydem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // The entities are turned into DTOs here, inside the transaction
    @Transactional(readOnly = true)
    public List<ProductResponse> listProducts() {
        return productRepository.findAll(Sort.by("id")).stream()
                .map(product -> ProductService.toResponse(product))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProduct(String slug) {
        return productRepository.findBySlug(slug)
                .map(product -> ProductService.toDetailResponse(product))
                .orElseThrow(() -> new ProductNotFoundException(slug));
    }

    private static ProductResponse toResponse(Product product) {
        return new ProductResponse(product.getId(), product.getSlug(), product.getName(),
                product.getPhotoUrl(), product.getPrice(), product.getAmount(), product.getUnit());
    }

    private static ProductDetailResponse toDetailResponse(Product product) {
        return new ProductDetailResponse(product.getId(), product.getSlug(), product.getName(),
                product.getPhotoUrl(), product.getPrice(), product.getAmount(), product.getUnit(),
                product.getDescription());
    }
}

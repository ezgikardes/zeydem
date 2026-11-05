package com.zeydem.service;

import com.zeydem.dto.ProductResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    // Written here until a test requires the database.
    public List<ProductResponse> listProducts() {
        return List.of(
                new ProductResponse(1L, "Natürel Sızma Zeytinyağı", "/products/zeytinyagi-1l.png",
                        new BigDecimal("450.00"), new BigDecimal("1"), "L"),
                new ProductResponse(2L, "Natürel Sızma Zeytinyağı", "/products/zeytinyagi-5l.png",
                        new BigDecimal("1950.00"), new BigDecimal("5"), "L"),
                new ProductResponse(3L, "Çiğ Badem", "/products/badem-500g.jpg",
                        new BigDecimal("320.00"), new BigDecimal("500"), "g"));
    }
}

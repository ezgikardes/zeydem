package com.zeydem.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;

// One product in the answer of GET /products (contracts/openapi.yaml).
public record ProductResponse(
        Long id,
        String name,
        String photoUrl,
        // Written as a string, "450.00", so it is never read as a floating-point number
        // (decisions/005-prices.md).
        @JsonFormat(shape = JsonFormat.Shape.STRING) BigDecimal price,
        BigDecimal amount,
        String unit) {
}

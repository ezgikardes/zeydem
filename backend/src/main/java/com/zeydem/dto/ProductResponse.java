package com.zeydem.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;

// One product in the answer of GET /products.
public record ProductResponse(
        Long id,
        String name,
        String photoUrl,
        @JsonFormat(shape = JsonFormat.Shape.STRING) BigDecimal price,
        BigDecimal amount,
        String unit) {
}

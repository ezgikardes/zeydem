package com.zeydem.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

// One row of the products table. Hibernate creates the table from this class (ddl-auto=update)
@Entity
@Table(name = "products",
        uniqueConstraints = @UniqueConstraint(name = "products_slug_key", columnNames = "slug"))
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    private Long id;

    @Column(nullable = false)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String photoUrl;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false, columnDefinition = "text")
    private String description;
}

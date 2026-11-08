package com.zeydem.repository;

import com.zeydem.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

// Spring Data writes the class behind this interface at startup: findAll, findById, save…
public interface ProductRepository extends JpaRepository<Product, Long> {
}

package com.zeydem.service;

// No product has this slug. ProblemDetailHandler turns it into a 404.
public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(String slug) {
        super("No product with slug " + slug);
    }
}

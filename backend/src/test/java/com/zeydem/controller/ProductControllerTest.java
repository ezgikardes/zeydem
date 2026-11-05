package com.zeydem.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// GET /products as contracts/openapi.yaml describes it. The whole app starts, on zeydem_test.
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void listsTheSeedProductsInIdOrderWithExactlyTheContractFields() throws Exception {
        // STRICT: same order, and no field more or less than written here. The price is a
        // string ("450.00"); a number 450.00 in its place fails the test.
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("""
                        [
                          {"id": 1, "name": "Natürel Sızma Zeytinyağı",
                           "photoUrl": "/products/zeytinyagi-1l.png",
                           "price": "450.00", "amount": 1, "unit": "L"},
                          {"id": 2, "name": "Natürel Sızma Zeytinyağı",
                           "photoUrl": "/products/zeytinyagi-5l.png",
                           "price": "1950.00", "amount": 5, "unit": "L"},
                          {"id": 3, "name": "Çiğ Badem",
                           "photoUrl": "/products/badem-500g.jpg",
                           "price": "320.00", "amount": 500, "unit": "g"}
                        ]
                        """, JsonCompareMode.STRICT));
    }
}

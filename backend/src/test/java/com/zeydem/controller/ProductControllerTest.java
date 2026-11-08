package com.zeydem.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlConfig;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// GET /products as contracts/openapi.yaml describes it
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void listsTheSeedProductsInIdOrderWithExactlyTheContractFields() throws Exception {
        // STRICT: same order, and no field more or less than written here. 
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

    // @Transactional undoes the INSERT when the test ends, so the other tests still see 3 products.
    @Test
    @Transactional
    void showsAProductAddedToTheTableByHand() throws Exception {
        jdbcTemplate.update("""
                INSERT INTO products (id, name, photo_url, price, amount, unit)
                VALUES (4, 'Ceviz', '/products/ceviz-500g.jpg', 280.00, 500, 'g')
                """);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[3].name").value("Ceviz"));
    }

    // The app has already run data.sql once when it started; @Sql runs it a second time
    @Test
    @Transactional
    @Sql(scripts = "/data.sql", config = @SqlConfig(encoding = "UTF-8"))
    void runningTheSeedAgainKeepsThreeProducts() {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Integer.class);

        assertThat(count).isEqualTo(3);
    }
}

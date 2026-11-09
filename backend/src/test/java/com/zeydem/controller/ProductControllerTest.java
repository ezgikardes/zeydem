package com.zeydem.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlConfig;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// GET /products and GET /products/{slug}
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
                          {"id": 1, "slug": "naturel-sizma-zeytinyagi-1l",
                           "name": "Natürel Sızma Zeytinyağı",
                           "photoUrl": "/products/zeytinyagi-1l.png",
                           "price": "450.00", "amount": 1, "unit": "L"},
                          {"id": 2, "slug": "naturel-sizma-zeytinyagi-5l",
                           "name": "Natürel Sızma Zeytinyağı",
                           "photoUrl": "/products/zeytinyagi-5l.png",
                           "price": "1950.00", "amount": 5, "unit": "L"},
                          {"id": 3, "slug": "cig-badem-500g", "name": "Çiğ Badem",
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
                INSERT INTO products (id, slug, name, photo_url, price, amount, unit, description)
                VALUES (4, 'ceviz-500g', 'Ceviz', '/products/ceviz-500g.jpg', 280.00, 500, 'g',
                        'Kabuksuz ceviz.')
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

    // STRICT again: the list fields plus description, nothing else.
    @Test
    void returnsOneProductBySlugWithItsDescription() throws Exception {
        mockMvc.perform(get("/products/naturel-sizma-zeytinyagi-1l"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("""
                        {"id": 1, "slug": "naturel-sizma-zeytinyagi-1l",
                         "name": "Natürel Sızma Zeytinyağı",
                         "photoUrl": "/products/zeytinyagi-1l.png",
                         "price": "450.00", "amount": 1, "unit": "L",
                         "description": "Manisa'daki bahçemizin zeytinlerinden sıkılan natürel sızma zeytinyağı. 1 litrelik şişe, günlük kullanım için."}
                        """, JsonCompareMode.STRICT));
    }

    // No detail: Spring's own 404 would say "No static resource …"
    @Test
    void answers404AsProblemDetailForAnUnknownSlug() throws Exception {
        mockMvc.perform(get("/products/zeytin-ezmesi"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Not Found"))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.instance").value("/products/zeytin-ezmesi"))
                .andExpect(jsonPath("$.detail").doesNotExist());
    }

    @Test
    @Transactional
    void theDatabaseRefusesASecondProductWithTheSameSlug() {
        assertThatThrownBy(() -> jdbcTemplate.update("""
                INSERT INTO products (id, slug, name, photo_url, price, amount, unit, description)
                VALUES (4, 'cig-badem-500g', 'Çiğ Badem', '/products/badem-500g.jpg', 320.00, 500,
                        'g', 'İkinci kopya.')
                """))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}

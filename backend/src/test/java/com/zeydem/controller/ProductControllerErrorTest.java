package com.zeydem.controller;

import com.zeydem.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// @WebMvcTest starts only the web layer (controllers and their advice), without the database.
@WebMvcTest(ProductController.class)
class ProductControllerErrorTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ProductService productService;

    @Test
    void answers500AsProblemDetailWhenTheDatabaseCannotBeRead() throws Exception {
        when(productService.listProducts()).thenThrow(new DataAccessResourceFailureException(
                "Connection to zeydem refused while running SELECT * FROM products"));

        mockMvc.perform(get("/products"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Internal Server Error"))
                .andExpect(jsonPath("$.status").value(500))
                // Nothing from the exception reaches the answer: no message, no SQL, no class name.
                .andExpect(content().string(not(containsString("SELECT"))))
                .andExpect(content().string(not(containsString("zeydem"))))
                .andExpect(content().string(not(containsString("DataAccess"))));
    }
}

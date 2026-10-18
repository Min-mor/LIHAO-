package com.febuki.tool.server.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Spring Boot API Documentation")
                        .version("1.0")
                        .description("Spring Boot 2.7.6 Swagger UI")
                        .contact(new Contact()
                                .name("febuki")
                                .email("febuki@example.com")));
    }
}
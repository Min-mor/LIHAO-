package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Schema(description = "产品信息")
public class ProductDTO {
    private Long id;
    private String name;
    private String destination;
    private BigDecimal price;
    private String itinerary;
    private Long userId;
    private String description;
    private Long stock;
    private short status;
    private boolean hotel;
}

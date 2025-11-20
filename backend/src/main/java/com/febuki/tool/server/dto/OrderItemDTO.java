package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Schema(description = "订单项")
public class OrderItemDTO {
    @Schema(description = "订单项ID", example = "1")
    private Long Id;

    @Schema(description = "订单ID", example = "1")
    private Long orderId;

    @Schema(description = "商品ID", example = "1")
    private Long productId;

    @Schema(description = "商品名称", example = "商品1")
    private String productTitle;

    @Schema(description = "单价", example = "10.00")
    private BigDecimal unitPrice;

    @Schema(description = "数量", example = "1")
    private Long quantity;

    public OrderItemDTO() {}

    public OrderItemDTO(Long id, Long orderId, Long productId, String productTitle, BigDecimal unitPrice, Long quantity) {
        Id = id;
        this.orderId = orderId;
        this.productId = productId;
        this.productTitle = productTitle;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }
}

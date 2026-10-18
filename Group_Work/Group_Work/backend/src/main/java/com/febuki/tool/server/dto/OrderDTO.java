package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "订单信息")
public class OrderDTO {
    @Schema(description = "订单id", hidden = true)
    private Long id;

    @Schema(description = "订单编号", hidden = true)
    private Long orderSN;

    @Schema(description = "用户id", example = "1")
    private Long userId;

    @Schema(description = "商品id", example = "1")
    private Long productId;

    @Schema(description = "购买数量", example = "1")
    private Integer quantity;

    @Schema(description = "订单总金额", hidden = true)
    private BigDecimal totalAmount;

    @Schema(description = "支付状态", hidden = true)
    private short paymentStatus;

    @Schema(description = "订单状态", hidden = true)
    private short orderStatus;

    @Schema(description = "创建时间", hidden = true)
    private LocalDateTime createdAt;

    public OrderDTO(Long id, Long orderSN, Long userId, Long productId, BigDecimal totalAmount, short paymentStatus, short orderStatus, LocalDateTime createdAt) {
        this.id = id;
        this.orderSN = orderSN;
        this.userId = userId;
        this.productId = productId;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
        this.orderStatus = orderStatus;
        this.createdAt = createdAt;
    }
}

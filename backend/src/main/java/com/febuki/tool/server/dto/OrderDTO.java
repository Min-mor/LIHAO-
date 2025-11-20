package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "订单信息")
public class OrderDTO {
    @Schema(description = "订单id", example = "1")
    private Long id;

    @Schema(description = "订单编号", example = "")
    private Long orderSN;

    @Schema(description = "用户id", example = "1")
    private Long userId;

    @Schema(description = "商品id", example = "1")
    private Long productId;

    @Schema(description = "订单总金额", example = "100.00")
    private BigDecimal totalAmount;

    @Schema(description = "支付状态", example = "0")
    private short paymentStatus;

    @Schema(description = "订单状态", example = "0")
    private boolean orderStatus;

    @Schema(description = "创建时间", example = "2022-10-01 00:00:00")
    private LocalDateTime createdAt;

    public OrderDTO() {}

    public OrderDTO(Long id, Long orderSN, Long userId, Long productId, BigDecimal totalAmount, short paymentStatus, boolean orderStatus, LocalDateTime createdAt) {
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

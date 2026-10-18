package com.febuki.tool.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Schema(hidden = true)
@TableName("orders")
public class Order {
    @TableId(value = "order_id", type = IdType.AUTO)
    private Long id;

    @TableField("order_sn")
    private Long orderSN;

    @TableField("user_id")
    private Long userId;

    @TableField("product_id")
    private Long productId;

    @TableField("total_amount")
    private BigDecimal totalAmount;

    @TableField("payment_status")
    private short paymentStatus;

    @TableField("order_status")
    private short orderStatus;

    @TableField("created_at")
    private LocalDateTime createdAt;
}

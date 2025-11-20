package com.febuki.tool.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Schema(hidden = true)
@TableName("order_items")
public class OrderItem {
    @TableId(type = IdType.AUTO)
    private Long Id;

    @TableField("order_id")
    private Long orderId;

    @TableField("product_id")
    private Long productId;

    @TableField("product_title")
    private String productTitle;

    @TableField("unit_price")
    private BigDecimal unitPrice;

    private Long quantity;
}

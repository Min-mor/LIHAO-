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
@TableName("products")
public class Product {
    @TableId(value = "product_id", type = IdType.AUTO)
    private Long id;

    @TableField("product_name")
    private String name;

    @TableField("destination_name")
    private String destination;

    private BigDecimal price;

    @TableField("Itinerary")
    private String itinerary;

    @TableField("user_id")
    private Long userId;

    private String description;
    private Long stock;
    private boolean status;

    @TableField("hotel_or_no")
    private boolean hotelOrNo;

    @TableField("hotel")
    private String hotel;

}

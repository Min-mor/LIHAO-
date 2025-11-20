package com.febuki.tool.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(hidden = true)
@TableName("travelers")
public class Traveler {
    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("full_name")
    private String fullName;

    @TableField("phone")
    private Long phone;

    @TableField("id_card_type")
    private short idCardType;

    @TableField("id_card_number")
    private String idCardNumber;

    @TableField("traveler_type")
    private Short travelerType;
}

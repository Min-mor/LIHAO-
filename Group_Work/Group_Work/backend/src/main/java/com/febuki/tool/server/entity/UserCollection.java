package com.febuki.tool.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(hidden = true)
@TableName("user_collections")
public class UserCollection {
    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("item_type")
    private String itemType;

    @TableField("item_id")
    private Long itemId;

    @TableField("item_provider")
    private String itemProvider;

    @TableField("item_name")
    private String itemName;

    @TableField("item_image_url")
    private String itemImageURL;

    @TableField("created_at")
    private LocalDateTime createdAt;
}

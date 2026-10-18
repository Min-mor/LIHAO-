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
@TableName("article_like")
public class ArticleLike {

    @TableField("user_id")
    private Long userId;

    @TableField("article_id")
    private Long articleId;

    private boolean status;

    private LocalDateTime time;
}

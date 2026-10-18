package com.febuki.tool.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Table;
import java.time.LocalDateTime;

@Getter
@Setter
@Schema(hidden = true)
@TableName("article")
public class Article {

    @TableId(value = "article_id", type = IdType.AUTO)
    private Long articleId;

    @TableField("user_id")
    private Long userId;

    private String title;

    @TableField("picture_url")
    private String pictureURL;

    private String content;

    private String location;

    @TableField("create_at")
    private LocalDateTime createAt;

    private int like;
    private int comments;
}

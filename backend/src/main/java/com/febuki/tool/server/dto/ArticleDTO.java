package com.febuki.tool.server.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "文章信息")
public class ArticleDTO {
    @Schema(description = "文章ID")
    private Long articleId;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "文章标题")
    private String title;

    @Schema(description = "文章图片URL")
    private String pictureURL;

    @Schema(description = "文章内容")
    private String content;

    @Schema(description = "文章位置")
    private String location;

    @Schema(description = "创建时间")
    private LocalDateTime createAt;

    @Schema(description = "点赞数")
    private int like;

    @Schema(description = "评论数")
    private int comments;
}

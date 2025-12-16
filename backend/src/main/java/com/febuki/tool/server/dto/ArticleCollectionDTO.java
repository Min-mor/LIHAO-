package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "文章收藏")
public class ArticleCollectionDTO {
    @Schema(description = "收藏ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "文章ID")
    private Long articleId;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}

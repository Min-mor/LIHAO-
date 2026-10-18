package com.febuki.tool.server.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.febuki.tool.server.entity.enums.ArticleCommentEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "文章评论")
public class ArticleCommentDTO {
    @Schema(description = "评论ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "文章ID")
    private Long articleId;

    @Schema(description = "评论内容")
    private String comment;

    @Schema(description = "父级评论ID")
    private Long parentId;

    @Schema(description = "根评论ID")
    private Long rootCommentId;

    @Schema(description = "回复评论ID")
    private Long replyCommentId;

    @Schema(description = "评论类型")
    private Enum<ArticleCommentEnum> commentReply = ArticleCommentEnum.COMMENT;

    @Schema(description = "用户头像URL")
    private String pictureURL;

    @Schema(description = "创建时间")
    private LocalDateTime createAt;
}

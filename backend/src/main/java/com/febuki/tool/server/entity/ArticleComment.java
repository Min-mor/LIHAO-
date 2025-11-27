package com.febuki.tool.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.febuki.tool.server.entity.enums.ArticleCommentEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(hidden = true)
@TableName("article_comment")
public class ArticleComment {
    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("article_id")
    private Long articleId;

    private String comment;

    @TableField("parent_id")
    private Long parentId;

    @TableField("root_comment_id")
    private Long rootCommentId;

    @TableField("reply_comment_id")
    private Long replyCommentId;

    @TableField("comment_reply")
    private Enum<ArticleCommentEnum> commentReply = ArticleCommentEnum.COMMENT;

    @TableField("picture_url")
    private String pictureURL;

    @TableField("create_at")
    private LocalDateTime createAt;
}

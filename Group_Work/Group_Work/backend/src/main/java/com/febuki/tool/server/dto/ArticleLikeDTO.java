package com.febuki.tool.server.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "文章点赞信息")
public class ArticleLikeDTO {
    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "文章ID")
    private Long articleId;

    @Schema(description = "点赞状态")
    private boolean status;

    @Schema(description = "点赞时间")
    private LocalDateTime time;
}

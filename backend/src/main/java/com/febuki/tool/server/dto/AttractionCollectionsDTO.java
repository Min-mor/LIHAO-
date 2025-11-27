package com.febuki.tool.server.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "景点收藏信息")
public class AttractionCollectionsDTO {
    @Schema(description = "景点收藏ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "景点名称")
    private String attractionName;

    @Schema(description = "景点ID")
    private Long productId;

    @Schema(description = "景点URL")
    private String attractionURL;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}

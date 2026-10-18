package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "用户收藏")
public class UserCollectionDTO {
    @Schema(description = "用户收藏id", example = "1")
    private Long id;

    @Schema(description = "用户id", example = "1")
    private Long userId;

    @Schema(description = "收藏项类型", example = "product")
    private String itemType;

    @Schema(description = "收藏项id", example = "1")
    private Long itemId;

    @Schema(description = "收藏项提供者", example = "product")
    private String itemProvider;

    @Schema(description = "收藏项名称", example = "商品")
    private String itemName;

    @Schema(description = "收藏项图片URL", example = "https://example.com/image.png")
    private String itemImageURL;

    @Schema(description = "创建时间", example = "2022-10-01 00:00:00")
    private LocalDateTime createdAt;

    public UserCollectionDTO() {}

    public UserCollectionDTO(Long id, Long userId, String itemType, Long itemId, String itemProvider, String itemName, String itemImageURL, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.itemType = itemType;
        this.itemId = itemId;
        this.itemProvider = itemProvider;
        this.itemName = itemName;
        this.itemImageURL = itemImageURL;
        this.createdAt = createdAt;
    }
}

package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "微信登录信息")
public class WeChatSessionKeyDTO {
    @Schema(description = "id")
    private String id;
    @Schema(description = "sessionKey_key")
    private String sessionKeyKey;
    @Schema(description = "微信登录sessionKey")
    private String sessionKey;
    @Schema(description = "过期时间")
    private LocalDateTime expirationTime;

    public WeChatSessionKeyDTO() {}

    public WeChatSessionKeyDTO(String sessionKey, LocalDateTime expirationTime) {
        this.sessionKey = sessionKey;
        this.expirationTime = expirationTime;
    }
}

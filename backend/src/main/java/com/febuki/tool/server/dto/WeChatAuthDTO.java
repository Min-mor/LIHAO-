package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "微信登录信息")
public class WeChatAuthDTO {
    @Schema(description = "微信openid")
    private String openId;
    @Schema(description = "微信头像")
    private String avatarUrl;
    @Schema(description = "微信昵称")
    private String nickName;

    public WeChatAuthDTO() {}

    public WeChatAuthDTO(String openId, String avatarUrl, String nickName) {
        this.openId = openId;
        this.avatarUrl = avatarUrl;
        this.nickName = nickName;
    }
}

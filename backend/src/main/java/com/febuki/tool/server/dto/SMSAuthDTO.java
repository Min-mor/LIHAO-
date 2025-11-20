package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "短信验证码登录参数")
public class SMSAuthDTO {
    @Schema(description = "key")
    private String key;
    @Schema(description = "code")
    private String code;
    @Schema(description = "过期时间")
    private LocalDateTime expirationTime;

    public SMSAuthDTO() {
    }

    public SMSAuthDTO(String key, String code, LocalDateTime expirationTime) {
        this.key = key;
        this.code = code;
        this.expirationTime = expirationTime;
    }
}

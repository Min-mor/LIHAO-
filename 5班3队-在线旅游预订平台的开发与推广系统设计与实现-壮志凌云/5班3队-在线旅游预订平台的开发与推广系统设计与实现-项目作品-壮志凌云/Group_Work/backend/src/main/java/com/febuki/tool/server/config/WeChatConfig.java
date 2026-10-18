package com.febuki.tool.server.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "wechat")
@Data
public class WeChatConfig {
    private String appId;
    private String appSecret;
    private String authUrl;
}

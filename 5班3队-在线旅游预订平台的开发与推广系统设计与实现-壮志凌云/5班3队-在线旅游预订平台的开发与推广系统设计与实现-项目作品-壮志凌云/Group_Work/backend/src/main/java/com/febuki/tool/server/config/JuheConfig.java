package com.febuki.tool.server.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "juhe")
@Data
public class JuheConfig {
    private String scenicApikey;
    private String trainApikey;
    private String url;
}

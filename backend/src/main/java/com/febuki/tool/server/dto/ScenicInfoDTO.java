package com.febuki.tool.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "景点详细信息")
public class ScenicInfoDTO {
    @Schema(description = "景点名称")
    @JsonProperty("name")
    private String name;

    @Schema(description = "景点内容")
    @JsonProperty("content")
    private String content;

    @Schema(description = "景点所在省")
    @JsonProperty("province")
    private String province;

    @Schema(description = "景点所在市")
    @JsonProperty("city")
    private String city;

    public ScenicInfoDTO() {}

    public ScenicInfoDTO(String name, String content, String province, String city) {
        this.name = name;
        this.content = content;
        this.province = province;
        this.city = city;
    }
}

package com.febuki.tool.server.dto;

import com.alibaba.fastjson.annotation.JSONField;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Schema(description = "景点列表")
public class ScenicListDTO {
    @Schema(description = "景点列表")
    @JSONField(name = "list")
    private List<ScenicInfoDTO> list;

    public ScenicListDTO() {
    }

    public ScenicListDTO(List<ScenicInfoDTO> list) {
        this.list = list;
    }
}

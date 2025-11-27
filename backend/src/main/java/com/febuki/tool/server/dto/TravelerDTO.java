package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "游客信息")
public class TravelerDTO {
    @Schema(description = "游客id", example = "1")
    private Long id;
    @Schema(description = "用户id", example = "1")
    private Long userId;
    @Schema(description = "游客姓名", example = "张三")
    private String fullName;
    @Schema(description = "游客手机号", example = "13800000000")
    private Long phone;
    @Schema(description = "证件类型", example = "1")
    private short idCardType;
    @Schema(description = "游客身份证号", example = "420000000000000000")
    private String idCardNumber;
    @Schema(description = "游客类型", example = "1")
    private Short travelerType;

    public TravelerDTO() {
    }

    public TravelerDTO(Long id, Long userId, String fullName, Long phone, short idCardType, String idCardNumber, Short travelerType) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.phone = phone;
        this.idCardType = idCardType;
        this.idCardNumber = idCardNumber;
        this.travelerType = travelerType;
    }
}

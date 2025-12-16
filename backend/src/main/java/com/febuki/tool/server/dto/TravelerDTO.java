package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Schema(description = "游客信息")
public class TravelerDTO {
    @Schema(description = "游客id", example = "1")
    private Long id;

    @NotNull(message = "所属用户ID不能为空")
    @Schema(description = "用户id", example = "1")
    private Long userId;

    @NotBlank(message = "游客姓名不能为空")
    @Schema(description = "游客姓名", example = "张三")
    private String fullName;

    @NotNull(message = "手机号不能为空")
    @Schema(description = "游客手机号", example = "13800000000")
    private String phone;

    @NotNull(message = "证件类型不能为空")
    @Schema(description = "证件类型 (1:身份证, 2:护照等)", example = "1")
    private Short idCardType;

    @NotBlank(message = "证件号码不能为空")
    @Schema(description = "游客证件号码", example = "420000000000000000")
    private String idCardNumber;

    @NotNull(message = "游客类型不能为空")
    @Schema(description = "游客类型 (0:成人, 1:儿童)", example = "0")
    private Short travelerType;

    public TravelerDTO() {}

    public TravelerDTO(Long id, Long userId, String fullName, String phone, short idCardType, String idCardNumber, Short travelerType) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.phone = phone;
        this.idCardType = idCardType;
        this.idCardNumber = idCardNumber;
        this.travelerType = travelerType;
    }
}

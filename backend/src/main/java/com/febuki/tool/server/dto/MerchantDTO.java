package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "商户信息")
public class MerchantDTO {
    @Schema(description = "商户id", example = "1")
    private Long id;

    @Schema(description = "商户名称", example = "商户名称")
    private String companyName;

    @Schema(description = "营业执照图片", example = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif")
    private String businessLicenseURL;

    @Schema(description = "审核状态", example = "0")
    private short verificationStatus;

    @Schema(description = "审核人", example = "1")
    private Long approvedBy;

    public MerchantDTO() {}

    public MerchantDTO(Long id, String companyName, String businessLicenseURL, short verificationStatus, Long approvedBy) {
        this.id = id;
        this.companyName = companyName;
        this.businessLicenseURL = businessLicenseURL;
        this.verificationStatus = verificationStatus;
        this.approvedBy = approvedBy;
    }
}

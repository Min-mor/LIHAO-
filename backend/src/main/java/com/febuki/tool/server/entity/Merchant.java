package com.febuki.tool.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(hidden = true)
@TableName("merchants")
public class Merchant {
    @TableId(value = "user_id", type = IdType.INPUT)
    private Long id;

    @TableField("company_name")
    private String companyName;

    @TableField("business_license_url")
    private String businessLicenseURL;

    @TableField("verification_status")
    private short verificationStatus;

    @TableField("approved_by")
    private Long approvedBy;
}

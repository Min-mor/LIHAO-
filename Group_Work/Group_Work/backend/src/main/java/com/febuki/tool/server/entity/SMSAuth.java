package com.febuki.tool.server.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(hidden = true)
@TableName("sms_auth")
public class SMSAuth {
    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField("sms_key")
    private String smsKey;

    @TableField("sms_code")
    private String smsCode;

    @TableField("expiration_time")
    private LocalDateTime expirationTime;
}

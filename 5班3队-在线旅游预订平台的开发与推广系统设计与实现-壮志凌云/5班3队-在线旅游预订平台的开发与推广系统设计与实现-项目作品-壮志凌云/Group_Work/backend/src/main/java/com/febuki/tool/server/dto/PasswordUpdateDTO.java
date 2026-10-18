package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@Setter
@Schema(description = "密码修改信息")
public class PasswordUpdateDTO {

    @Schema(description = "旧密码 (如果之前无密码可不填)", example = "123456")
    private String oldPassword;

    @NotBlank(message = "新密码不能为空")
    @Size(min = 6, max = 50, message = "密码长度应在6-50个字符之间")
    @Schema(description = "新密码", example = "654321")
    private String newPassword;

    @NotBlank(message = "确认密码不能为空")
    @Schema(description = "确认新密码", example = "654321")
    private String confirmPassword;
}
package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Getter
@Setter
@Schema(description = "用户注册信息")
public class RegisterDTO {

    @NotBlank(message = "用户名不能为空")
    @Pattern(regexp = "^[a-zA-Z0-9_]{4,20}$", message = "用户名格式不正确，应为4-20个字符的字母、数字或下划线")
    @Schema(description = "用户名", example = "johndoe", required = true)
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 50, message = "密码长度应在6-50个字符之间")
    @Schema(description = "密码", example = "123456", required = true)
    private String password;

    @Schema(description = "确认密码", example = "123456")
    private String confirmPassword;

    @Schema(description = "昵称", example = "John")
    private String nickname;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Schema(description = "手机号", example = "13888888888")
    private String tel;

    @Schema(description = "头像URL", example = "https://example.com/avatar.jpg")
    private String avatar;

    @Schema(description = "角色 ( 'merchant' 或 'customer' )。如果为空，默认为 'customer'", example = "customer")
    private String role;
}
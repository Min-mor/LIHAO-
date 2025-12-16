package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Getter
@Setter
@Schema(description = "用户信息")
public class UserDTO {
    @Schema(description = "用户id", hidden = true)
    private Long id;

    @NotBlank(message = "用户名不能为空")
    @Pattern(regexp = "^[a-zA-Z0-9_]{4,20}$", message = "用户名格式不正确，应为4-20个字符的字母、数字或下划线")
    @Schema(description = "用户名", example = "admin")
    private String username;

    @Schema(description = "昵称", example = "管理员")
    private String nickname;

    @Schema(description = "密码 (仅注册/重置时使用)", example = "123456")
    private String password;

    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Schema(description = "手机号", example = "13888888888")
    private String tel;

    @Email(message = "邮箱格式不正确")
    @Schema(description = "邮箱", example = "admin@example.com")
    private String email;

    @Schema(description = "角色 (customer, merchant, admin)", example = "customer")
    private String role;

    @Schema(description = "头像", example = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif")
    private String avatar = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";

    @Schema(description = "状态 (true:正常, false:封禁)", hidden = true)
    private boolean status;

    public UserDTO() {
    }

    public UserDTO(Long id, String username, String nickname, String password, String tel, String email, String role, String avatar, boolean status) {
        this.id = id;
        this.username = username;
        this.nickname = nickname;
        this.password = password;
        this.tel = tel;
        this.email = email;
        this.role = role;
        this.avatar = avatar;
        this.status = status;
    }
}

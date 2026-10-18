package com.febuki.tool.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "用户信息")
public class UserDTO {
    @Schema(description = "用户id", example = "1")
    private Long id;

    @Schema(description = "用户名", example = "admin")
    private String username;

    @Schema(description = "昵称", example = "管理员")
    private String nickname;

    @Schema(description = "密码", example = "123456")
    private String password;

    @Schema(description = "手机号", example = "13888888888")
    private String tel;

    @Schema(description = "邮箱", example = "admin@example.com")
    private String email;

    @Schema(description = "角色", example = "admin")
    private String role;

    @Schema(description = "头像", example = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif")
    private String avatar = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";

    @Schema(description = "状态", example = "0")
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

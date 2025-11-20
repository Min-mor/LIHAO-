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
@TableName("users")
public class User {
    @TableId(value = "user_id", type = IdType.AUTO)
    private Long id;

    @TableField("user_name")
    private String username;

    private String nickname = "";
    private String password;
    private String tel;
    private String email = "";
    private String role = "customer";

    @TableField("avatar_url")
    private String avatar = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";;
    private boolean status = true;
}

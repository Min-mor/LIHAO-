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
@TableName("wechat_auth")
public class WeChatAuth {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("open_id")
    private String openId;

    @TableField("avatar_url")
    private String avatarUrl;

    @TableField("nick_name")
    private String nickName;
}

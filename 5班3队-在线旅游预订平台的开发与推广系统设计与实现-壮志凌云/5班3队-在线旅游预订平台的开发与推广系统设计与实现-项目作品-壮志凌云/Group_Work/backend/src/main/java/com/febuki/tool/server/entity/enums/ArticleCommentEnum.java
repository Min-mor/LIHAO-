package com.febuki.tool.server.entity.enums;

import lombok.Getter;

@Getter
public enum ArticleCommentEnum {
    COMMENT("评论"),
    REPLY("回复");

    private final String type;

    ArticleCommentEnum(String type) {
        this.type = type;
    }
}

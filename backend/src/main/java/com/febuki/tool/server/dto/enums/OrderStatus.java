package com.febuki.tool.server.dto.enums;

import lombok.Getter;

@Getter
public enum OrderStatus {
    UNFINISHED((short) 0, "未完成"),
    PENDING_EVALUATION((short) 1, "待评价"),
    COMPLETED((short) 2, "已完成");

    private final short code;
    private final String desc;

    OrderStatus(short code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
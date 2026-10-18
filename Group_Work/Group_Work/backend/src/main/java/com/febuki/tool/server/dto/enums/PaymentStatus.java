package com.febuki.tool.server.dto.enums;

import lombok.Getter;

@Getter
public enum PaymentStatus {
    UNPAID((short) 0, "未支付"),
    PAID((short) 1, "支付完成");

    private final short code;
    private final String desc;

    PaymentStatus(short code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
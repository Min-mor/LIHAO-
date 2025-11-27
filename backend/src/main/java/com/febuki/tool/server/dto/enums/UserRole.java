package com.febuki.tool.server.dto.enums;

import lombok.Getter;

@Getter
public enum UserRole {
    ADMIN("admin"),
    MERCHANT("merchant"),
    CUSTOMER("customer");

    private final String roleName;

    UserRole(String roleName) {
        this.roleName = roleName;
    }

    /**
     * 检查字符串是否是有效的角色
     * @param role 要检查的字符串
     * @return true 如果是有效的角色, 否则 false
     */
    public static boolean isValid(String role) {
        if (role == null) return false;
        for (UserRole r : values()) {
            if (r.getRoleName().equals(role)) {
                return true;
            }
        }
        return false;
    }
}

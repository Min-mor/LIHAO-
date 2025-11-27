package com.febuki.tool.server.service;

public interface WeChatCacheServer {

    /**
     * 保存SessionKey到缓存
     */
    void saveSessionKey(String openid, String sessionKey, int expirationSeconds);

    /**
     * 获取SessionKey
     */
    String getSessionKey(String openid);

    /**
     * 删除SessionKey
     */
    void deleteSessionKey(String openid);

    /**
     * 检查SessionKey是否存在且未过期
     */
    boolean hasValidSessionKey(String openid);

    /**
     * 保存用户信息到缓存
     */
    void saveUserInfo(String openid, Object userInfo);

    /**
     * 获取用户信息
     */
    Object getUserInfo(String openid);

    /**
     * 删除用户信息
     */
    void deleteUserInfo(String openid);
}

package com.febuki.tool.server.service;

import com.febuki.tool.server.dto.WeChatAuthDTO;
import com.febuki.tool.server.entity.WeChatAuth;

import java.util.Map;

public interface WeChatAuthServer {

    // 获取 sessionKey
    String getSessionKey(String sessionKey);

    // 验证 sessionKey 参数
    boolean validateToken(String token);

    // 判断 sessionKey 是否过期
    boolean isExpired(String token);

    // 保存 sessionKey
    void saveSessionKey(String sessionKeyKey, String sessionKey);

    // 删除 sessionKey
    void deleteSessionKey(String sessionKey);

    // 设置过期时间
    void setExpirationTime(String token, int minutes);

    // 微信登录
    Map<String, Object> wechatLogin(String code);

    // 调用微信接口获取 session 信息
    Map<String, String> getWeChatSession(String code);

    // 创建用户
    void createUser(String openid);

    // 获取用户信息
    WeChatAuth getUserByOpenid(String openid);

    // 从 sessionKey 中获取用户 ID
    String getUserIdFromToken(String token);

    // 更新头像
    void updateAvatar(String openId, String avatarUrl);

    // 更新用户信息
    WeChatAuthDTO updateUserInfo(String openId, WeChatAuthDTO user);
}

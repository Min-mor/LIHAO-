package com.febuki.tool.server.service.impl;

import com.febuki.tool.server.service.WeChatCacheServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
public class WeChatCacheServerImpl implements WeChatCacheServer {

    private final CacheManager wechatCacheManager;
    private static final String SESSION_KEY_CACHE_NAME = "wechatSessionKey";
    private static final String USER_INFO_CACHE_NAME = "wechatUserInfo";

    public WeChatCacheServerImpl(@Qualifier("wechatCacheManager") CacheManager wechatCacheManager) {
        this.wechatCacheManager = wechatCacheManager;
    }

    /**
     * 保存SessionKey到缓存
     */
    @Override
    public void saveSessionKey(String openid, String sessionKey, int expirationSeconds) {
        try {
            Cache cache = wechatCacheManager.getCache(SESSION_KEY_CACHE_NAME);
            if (cache != null) {
                SessionKeyInfo sessionKeyInfo = new SessionKeyInfo(sessionKey, expirationSeconds);
                cache.put(openid, sessionKeyInfo);
                log.info("微信SessionKey已缓存 - OpenID: {}, 过期时间: {}秒", openid, expirationSeconds);
            } else {
                log.error("获取微信SessionKey缓存失败");
            }
        } catch (Exception e) {
            log.error("存储微信SessionKey到缓存失败", e);
            throw new RuntimeException("存储SessionKey失败", e);
        }
    }

    /**
     * 获取SessionKey
     */
    @Override
    public String getSessionKey(String openid) {
        Cache cache = wechatCacheManager.getCache(SESSION_KEY_CACHE_NAME);
        if (cache == null) {
            log.error("微信SessionKey缓存未初始化");
            return null;
        }

        Cache.ValueWrapper valueWrapper = cache.get(openid);
        if (valueWrapper == null) {
            return null;
        }

        SessionKeyInfo sessionKeyInfo = (SessionKeyInfo) valueWrapper.get();
        if (sessionKeyInfo.isExpired()) {
            // 如果过期，删除缓存
            cache.evict(openid);
            log.info("微信SessionKey已过期 - OpenID: {}", openid);
            return null;
        }

        return sessionKeyInfo.getSessionKey();
    }

    /**
     * 删除SessionKey
     */
    @Override
    public void deleteSessionKey(String openid) {
        Cache cache = wechatCacheManager.getCache(SESSION_KEY_CACHE_NAME);
        if (cache != null) {
            cache.evict(openid);
            log.info("微信SessionKey已删除 - OpenID: {}", openid);
        }
    }

    /**
     * 检查SessionKey是否存在且未过期
     */
    public boolean hasValidSessionKey(String openid) {
        String sessionKey = getSessionKey(openid);
        return sessionKey != null && !sessionKey.isEmpty();
    }

    /**
     * 保存用户信息到缓存
     */
    public void saveUserInfo(String openid, Object userInfo) {
        try {
            Cache cache = wechatCacheManager.getCache(USER_INFO_CACHE_NAME);
            if (cache != null) {
                cache.put(openid, userInfo);
                log.info("微信用户信息已缓存 - OpenID: {}", openid);
            }
        } catch (Exception e) {
            log.error("存储微信用户信息到缓存失败", e);
        }
    }

    /**
     * 获取用户信息
     */
    public Object getUserInfo(String openid) {
        Cache cache = wechatCacheManager.getCache(USER_INFO_CACHE_NAME);
        if (cache == null) {
            return null;
        }

        Cache.ValueWrapper valueWrapper = cache.get(openid);
        return valueWrapper != null ? valueWrapper.get() : null;
    }

    /**
     * 删除用户信息
     */
    public void deleteUserInfo(String openid) {
        Cache cache = wechatCacheManager.getCache(USER_INFO_CACHE_NAME);
        if (cache != null) {
            cache.evict(openid);
            log.info("微信用户信息已删除 - OpenID: {}", openid);
        }
    }

    /**
     * SessionKey信息类
     */
    private static class SessionKeyInfo {
        private final String sessionKey;
        private final LocalDateTime expireTime;

        SessionKeyInfo(String sessionKey, int expirationSeconds) {
            this.sessionKey = sessionKey;
            this.expireTime = LocalDateTime.now().plusSeconds(expirationSeconds);
        }

        String getSessionKey() {
            return sessionKey;
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(expireTime);
        }

        long getRemainingSeconds() {
            return LocalDateTime.now().until(expireTime, ChronoUnit.SECONDS);
        }
    }
}

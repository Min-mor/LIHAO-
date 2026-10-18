package com.febuki.tool.server.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * 主要CacheManager（用于通用缓存）
     */
    @Bean
    @Primary
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(30, TimeUnit.MINUTES) // 默认30分钟过期
                .maximumSize(1000) // 最大缓存数量
                .recordStats());
        return cacheManager;
    }

    /**
     * 短信验证码缓存管理器
     */
    @Bean("smsCacheManager")
    public CacheManager smsCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("smsCode");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(5, TimeUnit.MINUTES) // 5分钟过期
                .maximumSize(1000) // 最大缓存数量
                .recordStats());
        return cacheManager;
    }

    /**
     * 微信SessionKey缓存管理器
     */
    @Bean("wechatCacheManager")
    public CacheManager wechatCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("wechatSessionKey", "wechatUserInfo");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(7, TimeUnit.DAYS) // 30天过期
                .maximumSize(5000) // 最大缓存数量
                .recordStats());
        return cacheManager;
    }

    /**
     * Token黑名单缓存管理器
     */
    @Bean("tokenBlacklistCacheManager")
    public CacheManager tokenBlacklistCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("tokenBlacklist");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(30, TimeUnit.DAYS) // 黑名单保存30天
                .maximumSize(10000) // 最大黑名单数量
                .recordStats());
        return cacheManager;
    }
}
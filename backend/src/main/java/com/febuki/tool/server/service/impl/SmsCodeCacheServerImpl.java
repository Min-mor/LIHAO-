package com.febuki.tool.server.service.impl;

import com.febuki.tool.server.service.SmsCodeCacheServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Random;

@Slf4j
@Service("smsCodeCacheServer")
public class SmsCodeCacheServerImpl implements SmsCodeCacheServer {

    private final CacheManager smsCacheManager;
    private static final String SMS_CODE_CACHE_NAME = "smsCode";

    public SmsCodeCacheServerImpl(@Qualifier("smsCacheManager") CacheManager smsCacheManager) {
        this.smsCacheManager = smsCacheManager;
    }

    /**
     * 生成6位数字验证码
     */
    @Override
    public String generateCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    /**
     * 存储短信验证码
     */
    @Override
    public void saveSmsCode(String phone, String code) {
        try {
            Cache cache = smsCacheManager.getCache(SMS_CODE_CACHE_NAME);
            if (cache != null) {
                cache.put(phone, code);
                log.info("短信验证码已缓存 - 手机号: {}, 验证码: {}", phone, code);
            } else {
                log.error("获取短信验证码缓存失败");
            }
        } catch (Exception e) {
            log.error("存储短信验证码到缓存失败", e);
            throw new RuntimeException("存储验证码失败", e);
        }
    }

    /**
     * 获取短信验证码
     */
    @Override
    public String getSmsCode(String phone) {
        Cache cache = smsCacheManager.getCache(SMS_CODE_CACHE_NAME);
        if (cache == null) {
            log.error("短信验证码缓存未初始化");
            return null;
        }

        Cache.ValueWrapper valueWrapper = cache.get(phone);
        return valueWrapper != null ? (String) valueWrapper.get() : null;
    }

    /**
     * 验证短信验证码
     */
    @Override
    public boolean verifySmsCode(String phone, String code) {
        String storedCode = getSmsCode(phone);
        if (storedCode == null) {
            log.warn("验证码不存在或已过期 - 手机号: {}", phone);
            return false;
        }

        boolean isValid = storedCode.equals(code);
        if (isValid) {
            // 验证成功后删除缓存
            deleteSmsCode(phone);
            log.info("短信验证码验证成功 - 手机号: {}", phone);
        } else {
            log.warn("短信验证码验证失败 - 手机号: {}, 输入: {}, 期望: {}", phone, code, storedCode);
        }

        return isValid;
    }

    /**
     * 删除短信验证码
     */
    @Override
    public void deleteSmsCode(String phone) {
        Cache cache = smsCacheManager.getCache(SMS_CODE_CACHE_NAME);
        if (cache != null) {
            cache.evict(phone);
            log.info("短信验证码已删除 - 手机号: {}", phone);
        }
    }

    /**
     * 检查手机号是否已发送验证码
     */
    @Override
    public boolean hasSmsCode(String phone) {
        return getSmsCode(phone) != null;
    }
}
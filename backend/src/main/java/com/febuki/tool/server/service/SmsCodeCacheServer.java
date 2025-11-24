package com.febuki.tool.server.service;


import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.CacheManager;

public interface SmsCodeCacheServer {

    /**
     * 生成6位数字验证码
     */
    String generateCode();


    /**
     * 存储短信验证码
     */
    void saveSmsCode(String phone, String code);

    /**
     * 获取短信验证码
     */
    String getSmsCode(String phone);

    /**
     * 验证短信验证码
     */
    boolean verifySmsCode(String phone, String code);

    /**
     * 删除短信验证码
     */
    void deleteSmsCode(String phone);

    /**
     * 检查手机号是否已发送验证码
     */
    boolean hasSmsCode(String phone);
}

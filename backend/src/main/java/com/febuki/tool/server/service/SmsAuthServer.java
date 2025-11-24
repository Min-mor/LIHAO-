package com.febuki.tool.server.service;

import com.febuki.tool.server.entity.SMSAuth;

import java.util.Map;

public interface SmsAuthServer {
    /**
     * 生成验证码
     */
    String generateCode();

    /**
     * 发送短信验证码
     */
    String sendSmsCode(String phone);

    /**
     * 验证短信验证码
     */
    boolean verifySmsCode(String phone, String code);

    /**
     * 短信登录
     */
    Map<String, Object> loginBySms(String phone, String code);

    /**
     * 根据key查询短信验证码
     */
    SMSAuth findByKey(String key);

    /**
     * 根据key更新验证码
     */
    SMSAuth updateByKey(String key);

    /**
     * 根据key删除短信验证码
     */
    void deleteByKey(String key);
}

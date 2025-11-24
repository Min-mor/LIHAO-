package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.entity.SMSAuth;
import com.febuki.tool.server.entity.User;
import com.febuki.tool.server.mapper.SMSAuthMapper;
import com.febuki.tool.server.service.SmsAuthServer;
import com.febuki.tool.server.service.SmsCodeCacheServer;
import com.febuki.tool.server.service.UserServer;
import com.febuki.tool.server.utils.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Slf4j
@Service("smsAuthServer")
public class SmsAuthServerImpl extends ServiceImpl<SMSAuthMapper, SMSAuth> implements SmsAuthServer {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserServer userService;
    private final SmsCodeCacheServer smsCodeCacheServer;

    public SmsAuthServerImpl(@Autowired JwtTokenUtil jwtTokenUtil, @Autowired UserServer userService, @Autowired SmsCodeCacheServer smsCodeCacheServer) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userService = userService;
        this.smsCodeCacheServer = smsCodeCacheServer;
    }
    
    private static final String SMS_CODE_PREFIX = "SMS_CODE:";
    private static final long SMS_CODE_EXPIRE = 300; // 5分钟
    
    /**
     * 生成验证码
     */
    @Override
    public String generateCode() {
        return smsCodeCacheServer.generateCode();
    }
    
    /**
     * 发送短信验证码
     */
    @Override
    public String sendSmsCode(String phone) {
        log.info("开始发送短信验证码 - 手机号: {}", phone);

        // 验证手机号格式
        if (!isValidPhone(phone)) {
            log.error("手机号格式错误: {}", phone);
            throw new IllegalArgumentException("手机号格式错误");
        }


        try {
            // 生成验证码
            String code = generateCode();
            log.info("生成短信验证码成功 - 手机号: {}, 验证码: {}", phone, code);

            // 模拟发送短信（实际项目中替换为真实的短信服务）
            boolean sendResult = mockSendSms(phone, code);
            if (!sendResult) {
                log.error("短信发送失败 - 手机号: {}", phone);
                return null;
            }

            // 存储验证码到缓存
            smsCodeCacheServer.saveSmsCode(phone, code);
            log.info("短信验证码发送成功 - 手机号: {}", phone);

            return code;
        } catch (Exception e) {
            log.error("发送短信验证码异常 - 手机号: {}", phone, e);
            return null;
        }
    }

    /**
     * 模拟发送短信
     */
    private boolean mockSendSms(String phone, String code) {
        try {
            // 模拟网络延迟
            Thread.sleep(100);

            // 这里替换为实际的短信服务商API调用
            // 例如：阿里云短信、腾讯云短信等
            log.info("模拟发送短信 - 手机号: {}, 验证码: {}", phone, code);
            System.out.println("【模拟短信】发送验证码到 " + phone + ": " + code);

            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("模拟发送短信被中断", e);
            return false;
        } catch (Exception e) {
            log.error("模拟发送短信异常", e);
            return false;
        }
    }
    
    /**
     * 验证短信验证码
     */
    @Override
    public boolean verifySmsCode(String phone, String code) {
        log.info("开始验证短信验证码 - 手机号: {}, 验证码: {}", phone, code);

        if (!isValidPhone(phone)) {
            log.error("手机号格式错误: {}", phone);
            throw new IllegalArgumentException("手机号格式错误");
        }

        if (!StringUtils.hasText(code)) {
            log.error("验证码为空 - 手机号: {}", phone);
            throw new IllegalArgumentException("验证码不能为空");
        }

        boolean isValid = smsCodeCacheServer.verifySmsCode(phone, code);
        if (!isValid) {
            throw new IllegalArgumentException("验证码错误或已过期");
        }

        return true;
    }
    
    /**
     * 短信登录
     */
    @Override
    public Map<String, Object> loginBySms(String phone, String code) {
        Map<String, Object> result = new HashMap<>();

        log.info("开始短信登录 - 手机号: {}", phone);

        try {
            // 验证手机号格式
            if (!isValidPhone(phone)) {
                result.put("success", false);
                result.put("message", "手机号格式不正确");
                return result;
            }

            // 验证验证码
            if (!verifySmsCode(phone, code)) {
                result.put("success", false);
                result.put("message", "验证码错误或已过期");
                return result;
            }

            // 查询或创建用户
            User user = userService.findByPhone(phone);
            if (user == null) {
                log.info("用户不存在，自动注册 - 手机号: {}", phone);
                // 自动注册
                user = new User();
                user.setTel(phone);
                user.setUsername(generateUsername(phone));
                userService.saveUser(user);
                log.info("用户自动注册成功 - 手机号: {}, 用户ID: {}", phone, user.getId());
            }

            // 检查用户状态
            if (!user.isStatus()) {
                result.put("success", false);
                result.put("message", "账号已被禁用");
                return result;
            }

            // 生成短信登录token
            String token = jwtTokenUtil.generateSmsToken(user.getId(), phone);

            result.put("success", true);
            result.put("token", token);
            result.put("user", user);
            result.put("loginType", "sms");

            log.info("短信登录成功 - 手机号: {}, 用户ID: {}", phone, user.getId());

        } catch (IllegalArgumentException e) {
            log.warn("短信登录验证失败 - 手机号: {}, 原因: {}", phone, e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        } catch (Exception e) {
            log.error("短信登录异常 - 手机号: {}", phone, e);
            result.put("success", false);
            result.put("message", "系统异常，请稍后重试");
        }

        return result;
    }

    /**
     * 生成用户名
     */
    private String generateUsername(String phone) {
        return "用户_" + phone.substring(phone.length() - 4);
    }

    /**
     * 验证手机号格式
     */
    private boolean isValidPhone(String phone) {
        if (!StringUtils.hasText(phone) || phone.length() != 11) {
            return false;
        }
        return phone.matches("^1[3-9]\\d{9}$");
    }

    // 以下方法不再需要，因为使用缓存替代了数据库操作
    @Override
    public SMSAuth findByKey(String key) {
        throw new UnsupportedOperationException("findByKey 该方法已废弃，请使用缓存版本");
    }

    @Override
    public SMSAuth updateByKey(String key) {
        throw new UnsupportedOperationException("updateByKey 该方法已废弃，请使用缓存版本");
    }

    @Override
    public void deleteByKey(String key) {
        throw new UnsupportedOperationException("deleteByKey 该方法已废弃，请使用缓存版本");
    }
}
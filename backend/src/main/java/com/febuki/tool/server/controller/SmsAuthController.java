package com.febuki.tool.server.controller;

import com.febuki.tool.server.service.SmsAuthServer;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth/sms")
@Tag(name = "短信验证码服务", description = "短信验证码服务")
public class SmsAuthController {

    private final SmsAuthServer smsAuthService;

    public SmsAuthController(@Autowired SmsAuthServer smsAuthService) {
        this.smsAuthService = smsAuthService;
    }

    @PostMapping("/sendCode")
    @Operation(summary = "发送短信验证码", description = "发送短信验证码")
    public ResponseEntity<?> sendSmsCode(
            @Parameter(
                    description = "手机号",
                    example = "13800000000"
            )
            @RequestParam String phone
    ) {
        log.info("发送短信验证码: {}", phone);
        String code = smsAuthService.sendSmsCode(phone);
        if (code != null) {
            log.info("验证码发送成功: {}", phone);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "验证码发送成功"),
                            MapUtils.Pair.of("smsCode", code)
                    )
            );
        } else {
            log.error("验证码发送失败: {}", phone);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.INTERNAL_SERVER_ERROR.value()),
                            MapUtils.Pair.of("message", "验证码发送失败")
                    )
            );
        }
    }
    
    @PostMapping("/login")
    @Operation(summary = "短信登录", description = "短信登录")
    public Map<String, Object> loginBySms(
            @Parameter(
                    description = "手机号",
                    example = "13800000000"
            )
            @RequestParam String phone,
            @Parameter(
                    description = "验证码",
                    example = "123456"
            )
            @RequestParam String code
    ) {
        log.info("短信登录: {}, {}", phone, code);
        return smsAuthService.loginBySms(phone, code);
    }
}
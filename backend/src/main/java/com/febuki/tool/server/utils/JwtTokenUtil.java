package com.febuki.tool.server.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtTokenUtil implements Serializable {
    
    private static final long serialVersionUID = -2550185165626007488L;
    
    // 从配置文件中读取
    @Value("${jwt.secret:mySecret}")
    private String secret;
    
    @Getter
    @Value("${jwt.expiration:604800}")
    private Long expiration; // 默认7天

    /**
     * 生成微信登录token
     */
    public String generateWeChatToken(String userId, String openid) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("openid", openid);
        claims.put("loginType", "wechat"); // 添加登录类型标识

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * 生成短信登录token
     */
    public String generateSmsToken(Long userId, String phone) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("phone", phone);
        claims.put("loginType", "sms"); // 添加登录类型标识

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
    
    /**
     * 生成token
     */
    public String generateToken(Long userId, Map<String, Object> additionalClaims) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        if (additionalClaims != null) {
            claims.putAll(additionalClaims);
        }
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
    
    /**
     * 从token中获取用户ID
     */
    public String getUserIdFromToken(String token) {
        return getClaimFromToken(token, "userId", String.class);
    }
    
    /**
     * 从token中获取openid
     */
    public String getOpenidFromToken(String token) {
        return getClaimFromToken(token, "openid", String.class);
    }

    /**
     * 从token中获取手机号
     */
    public String getPhoneFromToken(String token) {
        return getClaimFromToken(token, "phone", String.class);
    }

    /**
     * 获取登录类型
     */
    public String getLoginTypeFromToken(String token) {
        return getClaimFromToken(token, "loginType", String.class);
    }
    
    /**
     * 从token中获取指定声明
     */
    public <T> T getClaimFromToken(String token, String claimName, Class<T> requiredType) {
        final Claims claims = getAllClaimsFromToken(token);
        return claims.get(claimName, requiredType);
    }
    
    /**
     * 获取token过期时间
     */
    public Date getExpirationDateFromToken(String token) {
        log.info("获取token过期时间: {}", getAllClaimsFromToken(token).getExpiration());
        return getAllClaimsFromToken(token).getExpiration();
    }
    
    /**
     * 解析token
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * 验证token是否过期
     */
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }
    
    /**
     * 验证token
     */
    public Boolean validateToken(String token) {
        try {
            log.info("验证token: {}", token);
            getAllClaimsFromToken(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}
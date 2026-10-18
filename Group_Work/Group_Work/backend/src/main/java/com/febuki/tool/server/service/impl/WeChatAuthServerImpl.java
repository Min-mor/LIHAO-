package com.febuki.tool.server.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.config.WeChatConfig;
import com.febuki.tool.server.dto.WeChatAuthDTO;
import com.febuki.tool.server.entity.WeChatAuth;
import com.febuki.tool.server.entity.WeChatSessionKey;
import com.febuki.tool.server.mapper.WeChatAuthMapper;
import com.febuki.tool.server.mapper.WeChatSessionKeyMapper;
import com.febuki.tool.server.service.WeChatAuthServer;
import com.febuki.tool.server.service.WeChatCacheServer;
import com.febuki.tool.server.utils.JwtTokenUtil;
import com.febuki.tool.server.utils.MapUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service("wechatAuthServer")
public class WeChatAuthServerImpl extends ServiceImpl<WeChatAuthMapper, WeChatAuth> implements WeChatAuthServer {

    private final WeChatConfig wechatConfig;
    private final JwtTokenUtil jwtTokenUtil;
    private final WeChatCacheServer weChatCacheServer;

    public WeChatAuthServerImpl(
            @Autowired WeChatConfig wechatConfig,
            @Autowired JwtTokenUtil jwtTokenUtil,
            @Autowired WeChatCacheServer weChatCacheServer
    ) {
        this.wechatConfig = wechatConfig;
        this.jwtTokenUtil = jwtTokenUtil;
        this.weChatCacheServer = weChatCacheServer;
    }

    @Override
    public String getSessionKey(String sessionKeyKey) {
        log.info("获取微信SessionKey - sessionKeyKey: {}", sessionKeyKey);
        String sessionKey = weChatCacheServer.getSessionKey(sessionKeyKey);
        if (sessionKey == null) {
            log.warn("微信SessionKey不存在或已过期 - sessionKeyKey: {}", sessionKeyKey);
            throw new RuntimeException("SessionKey不存在或已过期");
        }
        return sessionKey;
    }

    @Override
    public boolean validateToken(String token) {
        log.info("验证token: {}", token);
        return jwtTokenUtil.validateToken(token);
    }

    @Override
    public boolean isExpired(String sessionKeyKey) {
        boolean expired = !weChatCacheServer.hasValidSessionKey(sessionKeyKey);
        log.info("检查微信SessionKey是否过期 - OpenID: {}, 结果: {}", sessionKeyKey, expired);
        return expired;
    }

    @Override
    public void saveSessionKey(String sessionKeyKey, String sessionKey) {
        log.info("保存微信SessionKey - sessionKeyKey: {}", sessionKeyKey);
        // 微信session_key默认有效期为30天，这里设置缓存过期时间为29天，确保提前更新
        int expirationSeconds = 29 * 24 * 60 * 60; // 29天
        weChatCacheServer.saveSessionKey(sessionKeyKey, sessionKey, expirationSeconds);
    }

    @Override
    public void deleteSessionKey(String sessionKeyKey) {
        log.info("删除微信SessionKey - sessionKeyKey: {}", sessionKeyKey);
        weChatCacheServer.deleteSessionKey(sessionKeyKey);
    }

    @Override
    public void setExpirationTime(String sessionKey, int minutes) {
        log.warn("设置微信SessionKey过期时间功能已废弃 - sessionKey: {}, 分钟: {}", sessionKey, minutes);
        // 由于使用缓存自动过期，此方法不再需要
        // 可以保留方法签名但不做具体实现，或者抛出异常
        throw new UnsupportedOperationException("该方法已废弃，SessionKey过期时间由缓存自动管理");
    }

    @Override
    public Map<String, Object> wechatLogin(String code) {
        log.info("开始微信登录 - Code: {}", code);

        try {
            // 调用微信接口获取 openid 和 session_key
            Map<String, String> wechatResult  = getWeChatSession(code);
            String openid = wechatResult.get("openid");
            String sessionKey = wechatResult.get("session_key");
            String expiresIn = wechatResult.get("expires_in");

            if (openid == null) {
                String errmsg = wechatResult.get("errmsg");
                log.error("微信登录失败 - Code: {}, 错误: {}", code, errmsg);
                throw new RuntimeException("微信登录失败: " + errmsg);
            }

            log.info("微信登录成功 - OpenID: {}", openid);

            // 查询用户是否存在
            WeChatAuth user = getUserByOpenid(openid);
            log.info("查询用户信息 - OpenID: {}, 用户: {}", openid, user);
            if (user == null) {
                // 创建用户
                log.info("用户不存在，创建新用户 - OpenID: {}", openid);
                createUser(openid);
                user = getUserByOpenid(openid);
            }

            // 生成 sessionKey
            String token = jwtTokenUtil.generateWeChatToken(user.getOpenId(), openid);

            // 存储 session_key 到缓存
            String sessionKeyKey = "wechat:session_key:" + openid;
            saveSessionKey(sessionKeyKey, sessionKey);

            // 返回结果
            Map<String, Object> result = MapUtils.of(
                    MapUtils.Pair.of("loginType", "wechat"),
                    MapUtils.Pair.of("token", token),
                    MapUtils.Pair.of("userInfo", user),
                    MapUtils.Pair.of("expiresIn", jwtTokenUtil.getExpiration())
            );
            log.info("微信登录完成 - OpenID: {}, Token生成成功", openid);
            return result;
        } catch (Exception e) {
            log.error("微信登录异常 - Code: {}", code, e);
            throw new RuntimeException("微信登录异常: " + e.getMessage());
        }
    }

    @Override
    public Map<String, String> getWeChatSession(String code) {
        String url = wechatConfig.getAuthUrl() +
                "?appid=" + wechatConfig.getAppId() +
                "&secret=" + wechatConfig.getAppSecret() +
                "&js_code=" + code +
                "&grant_type=authorization_code";

        log.info("调用微信登录接口 - URL: {}", url.replace(wechatConfig.getAppSecret(), "***"));
        try {
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);
            log.info("微信接口响应: {}", response);

            Map<String, String> result = JSON.parseObject(response, Map.class);
            // 检查微信返回错误
            if (result != null && result.containsKey("errcode")) {
                String errcode = result.get("errcode");
                String errmsg = result.get("errmsg");
                if (!"0".equals(errcode)) {
                    log.error("微信接口返回错误 - ErrCode: {}, ErrMsg: {}", errcode, errmsg);
                    throw new RuntimeException("微信接口错误: " + errmsg);
                }
            }

            return result;
        } catch (Exception e) {
            log.error("微信登录接口调用失败", e);
            throw new RuntimeException("微信服务异常: " + e.getMessage());
        }
    }

    @Override
    public void createUser(String openid) {
        // 创建用户
        log.info("创建微信用户 - OpenID: {}", openid);

        if (openid == null) {
            throw new RuntimeException("openid不能为空");
        }

        WeChatAuth user = getUserByOpenid(openid);
        if (user == null) {
            user = new WeChatAuth();
            user.setOpenId(openid);
            // 设置默认用户名
            user.setNickName("微信用户_" + openid.substring(openid.length() - 8));
            baseMapper.insert(user);
            log.info("微信用户创建成功 - OpenID: {}", openid);
        } else {
            log.info("微信用户已存在 - OpenID: {}", openid);
        }
    }

    @Override
    public WeChatAuth getUserByOpenid(String openid) {
        log.debug("查询微信用户 - OpenID: {}", openid);
        // 先尝试从缓存获取
        Object cachedUser = weChatCacheServer.getUserInfo(openid);
        if (cachedUser instanceof WeChatAuth) {
            log.debug("从缓存获取用户信息 - OpenID: {}", openid);
            return (WeChatAuth) cachedUser;
        }

        // 缓存中没有，从数据库查询
        WeChatAuth user = baseMapper.selectOne(new QueryWrapper<WeChatAuth>().eq("open_id", openid));
        if (user != null) {
            // 存入缓存
            weChatCacheServer.saveUserInfo(openid, user);
        }

        return user;
    }

    @Override
    public String getUserIdFromToken(String token) {
        return jwtTokenUtil.getUserIdFromToken(token);
    }

    @Override
    public void updateAvatar(String openId, String avatarUrl) {
        if (openId == null) {
            throw new RuntimeException("openId不能为空");
        }

        WeChatAuth user = getUserByOpenid(openId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        user.setAvatarUrl(avatarUrl);
        baseMapper.updateById(user);
    }

    @Override
    public WeChatAuthDTO updateUserInfo(String openId, WeChatAuthDTO user) {
        if (openId == null) {
            throw new RuntimeException("openId不能为空");
        }

        WeChatAuth weChatAuth = getUserByOpenid(openId);
        if (weChatAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        weChatAuth.setNickName(user.getNickName());
        weChatAuth.setAvatarUrl(user.getAvatarUrl());
        baseMapper.updateById(weChatAuth);

        return new WeChatAuthDTO(weChatAuth.getOpenId(), weChatAuth.getAvatarUrl(), weChatAuth.getNickName());
    }
}

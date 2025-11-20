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
import com.febuki.tool.server.utils.JwtTokenUtil;
import com.febuki.tool.server.utils.MapUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service("wechatAuthServer")
public class WeChatAuthServerImpl extends ServiceImpl<WeChatAuthMapper, WeChatAuth> implements WeChatAuthServer {

    private final WeChatSessionKeyMapper weChatSessionKeyMapper;
    private final WeChatConfig wechatConfig;
    private final JwtTokenUtil jwtTokenUtil;

    public WeChatAuthServerImpl(WeChatSessionKeyMapper weChatSessionKeyMapper, WeChatConfig wechatConfig, JwtTokenUtil jwtTokenUtil) {
        this.weChatSessionKeyMapper = weChatSessionKeyMapper;
        this.wechatConfig = wechatConfig;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public String getSessionKey(String sessionKey) {
        return weChatSessionKeyMapper.selectOne(new QueryWrapper<WeChatSessionKey>().eq("sessionKey", sessionKey)).getSessionKey();
    }

    @Override
    public boolean validateToken(String token) {
        log.info("验证token: {}", token);
        return jwtTokenUtil.validateToken(token);
    }

    @Override
    public boolean isExpired(String sessionKeyKey) {
        WeChatSessionKey key = weChatSessionKeyMapper.selectOne(new QueryWrapper<WeChatSessionKey>().eq("session_key_key", sessionKeyKey));

        return key.getExpirationTime().isBefore(LocalDateTime.now());
    }

    @Override
    public void saveSessionKey(String sessionKeyKey, String sessionKey) {
        // 判断 session_key 是否存在
        WeChatSessionKey key = weChatSessionKeyMapper.selectOne(new QueryWrapper<WeChatSessionKey>().eq("session_key_key", sessionKeyKey));

        if (key == null) {
            // 创建 session_key
            key = new WeChatSessionKey();
            key.setSessionKeyKey(sessionKeyKey);
            key.setSessionKey(sessionKey);
            key.setExpirationTime(LocalDateTime.now().plusSeconds(jwtTokenUtil.getExpiration()));
            weChatSessionKeyMapper.insert(key);
            return;
        }

        // 判断 session_key 是否过期
        if (isExpired(key.getSessionKeyKey())) {
            // 更新 session_key
            key.setSessionKey(sessionKey);
            key.setExpirationTime(LocalDateTime.now().plusSeconds(jwtTokenUtil.getExpiration()));
            weChatSessionKeyMapper.updateById(key);
        }
    }

    @Override
    public void deleteSessionKey(String sessionKeyKey) {
        // 判断 sessionKey 是否存在
        WeChatSessionKey key = weChatSessionKeyMapper.selectOne(new QueryWrapper<WeChatSessionKey>().eq("session_key_key", sessionKeyKey));
        if (key != null) {
            // 删除 sessionKey
            baseMapper.deleteById(key.getId());
        }
    }

    @Override
    public void setExpirationTime(String sessionKey, int minutes) {

        WeChatSessionKey key = weChatSessionKeyMapper.selectOne(new QueryWrapper<WeChatSessionKey>().eq("sessionKey", sessionKey));
        // 判断 sessionKey 是否存在
        if (key == null) {
            throw new RuntimeException("token不存在");
        }

        key.setExpirationTime(LocalDateTime.now().plusSeconds(minutes));
        weChatSessionKeyMapper.updateById(key);
    }

    @Override
    public Map<String, Object> wechatLogin(String code) {
        // 调用微信接口获取 openid 和 session_key
        Map<String, String> wechatResult  = getWeChatSession(code);
        String openid = wechatResult.get("openid");
        String sessionKey = wechatResult.get("session_key");

        if (openid == null) {
            throw new RuntimeException("微信登录失败" + wechatResult.get("errmsg"));
        }

        // 查询用户是否存在
        WeChatAuth user = getUserByOpenid(openid);
        log.info("用户信息: {}", user);
        if (user == null) {
            // 创建用户
            createUser(openid);
            user = getUserByOpenid(openid);
        }

        // 生成 sessionKey
        String token = jwtTokenUtil.generateWeChatToken(user.getOpenId(), openid);

        // 存储 session_key
        String sessionKeyKey = "wechat:session_key:" + openid;
        saveSessionKey(sessionKeyKey, sessionKey);

        // 返回结果
        return MapUtils.of(
                MapUtils.Pair.of("loginType", "wechat"),
                MapUtils.Pair.of("token", token),
                MapUtils.Pair.of("userInfo", user),
                MapUtils.Pair.of("expiresIn", jwtTokenUtil.getExpiration())
        );
    }

    @Override
    public Map<String, String> getWeChatSession(String code) {
        String url = wechatConfig.getAuthUrl() +
                "?appid=" + wechatConfig.getAppId() +
                "&secret=" + wechatConfig.getAppSecret() +
                "&js_code=" + code +
                "&grant_type=authorization_code";

        log.info("微信登录接口调用开始 url: {}", url);
        try {
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);
            return JSON.parseObject(response, Map.class);
        } catch (Exception e) {
            log.error("微信登录接口调用失败", e);
            throw new RuntimeException("微信服务异常");
        }
    }

    @Override
    public void createUser(String openid) {
        // 创建用户
        if (openid == null) {
            throw new RuntimeException("openid不能为空");
        }

        WeChatAuth user = getUserByOpenid(openid);
        if (user == null) {
            user = new WeChatAuth();
            user.setOpenId(openid);
            baseMapper.insert(user);
        }
    }

    @Override
    public WeChatAuth getUserByOpenid(String openid) {
        return baseMapper.selectOne(new QueryWrapper<WeChatAuth>().eq("open_id", openid));
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

package com.febuki.tool.server.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.febuki.tool.server.config.WeChatConfig;
import org.springframework.stereotype.Component;

@Component
public class WechatUtil {

    private final WeChatConfig wechatConfig;

    private static final String WX_LOGIN_URL = "https://api.weixin.qq.com/sns/jscode2session";

    public WechatUtil(WeChatConfig wechatConfig) {
        this.wechatConfig = wechatConfig;
    }

    public JSONObject jscode2session(String code) {
        String url = WX_LOGIN_URL + "?appid=" + wechatConfig.getAppId() + "&secret=" + wechatConfig.getAppSecret() + "&js_code=" + code + "&grant_type=authorization_code";
        String result = HttpClientUtil.get(url);
        return JSON.parseObject(result);
    }
}

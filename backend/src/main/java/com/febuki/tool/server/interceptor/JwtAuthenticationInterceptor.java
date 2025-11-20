package com.febuki.tool.server.interceptor;

import com.febuki.tool.server.utils.JwtTokenUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationInterceptor implements HandlerInterceptor {

    private final JwtTokenUtil jwtTokenUtil;

    public JwtAuthenticationInterceptor(@Autowired JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 放行OPTIONS请求
        if (HttpMethod.OPTIONS.toString().equals(request.getMethod())) {
            return true;
        }

        // 检查是否有不需要验证的注解
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            IgnoreAuth ignoreAuth = handlerMethod.getMethodAnnotation(IgnoreAuth.class);
            if (ignoreAuth != null) {
                return true;
            }
        }

        // 获取token
        String token = request.getHeader("Authorization");
        if (StringUtils.isEmpty(token)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"code\":401,\"message\":\"未提供认证token\"}");
            return false;
        }

        // 验证token
        if (!jwtTokenUtil.validateToken(token)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"code\":401,\"message\":\"token无效或已过期\"}");
            return false;
        }

        // 将用户信息设置到请求属性中
        String userId = jwtTokenUtil.getUserIdFromToken(token);
        String loginType = jwtTokenUtil.getLoginTypeFromToken(token);

        request.setAttribute("userId", userId);
        request.setAttribute("loginType", loginType);

        // 根据登录类型设置不同的属性
        if ("wechat".equals(loginType)) {
            String openid = jwtTokenUtil.getOpenidFromToken(token);
            request.setAttribute("openid", openid);
        } else if ("sms".equals(loginType)) {
            String phone = jwtTokenUtil.getPhoneFromToken(token);
            request.setAttribute("phone", phone);
        }

        return true;
    }
}
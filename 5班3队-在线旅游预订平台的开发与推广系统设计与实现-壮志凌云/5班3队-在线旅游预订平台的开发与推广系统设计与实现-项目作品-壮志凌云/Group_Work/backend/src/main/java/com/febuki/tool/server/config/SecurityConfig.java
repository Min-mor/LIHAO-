package com.febuki.tool.server.config;

import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final AntPathRequestMatcher[] SWAGGER_WHITELIST = {
        new AntPathRequestMatcher("/swagger-ui/**"),
        new AntPathRequestMatcher("/swagger-ui.html"),
        new AntPathRequestMatcher("/v3/api-docs/**"),
        new AntPathRequestMatcher("/api-docs/**"),
        new AntPathRequestMatcher("/api-docs.yaml"),
        new AntPathRequestMatcher("/webjars/**"),
        new AntPathRequestMatcher("/swagger-resources/**"),
        new AntPathRequestMatcher("/swagger-resources"),
        new AntPathRequestMatcher("/configuration/ui"),
        new AntPathRequestMatcher("/configuration/security"),
        new AntPathRequestMatcher("/api/**"),
        new AntPathRequestMatcher("/wechat/**"),
        new AntPathRequestMatcher("/wechat.html")
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(SWAGGER_WHITELIST).permitAll()
                .anyRequest().authenticated()
            )
            // 临时禁用 CSRF
            .csrf(AbstractHttpConfigurer::disable
//                .ignoringRequestMatchers(SWAGGER_WHITELIST)
            )
            // 添加日志
            .headers(headers -> headers
                .frameOptions().disable()
            );

        return http.build();
    }
}
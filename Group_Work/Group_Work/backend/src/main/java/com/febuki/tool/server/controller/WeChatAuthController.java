package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.UserDTO;
import com.febuki.tool.server.dto.WeChatAuthDTO;
import com.febuki.tool.server.service.WeChatAuthServer;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@Tag(name = "微信授权", description = "微信授权接口")
public class WeChatAuthController {

    private final String uploadDir;

    private final String accessUrl;

    private final WeChatAuthServer wechatAuthServer;

    public WeChatAuthController(
            @Value("${file.upload-dir}") String uploadDir,
            @Value("${file.access-url}") String accessUrl,
            WeChatAuthServer wechatAuthServer
    ) {
        this.uploadDir = uploadDir;
        this.accessUrl = accessUrl;
        this.wechatAuthServer = wechatAuthServer;
    }

    // 微信登录
    @PostMapping("/wechat-login")
    @Operation(summary = "微信登录", description = "微信登录")
    public ResponseEntity<?> wechatLogin(
            @Parameter(
                    description = "",
                    required = true
            )
            @RequestBody Map<String, String> params
    ) {
        String code = params.get("code");
        log.info("微信登录: code={}", code);
        if (code == null) {
            log.error("微信登录失败: code 不能为空");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("error", "code 不能为空")
                    )
            );
        }

        try {
            Map<String, Object> result = wechatAuthServer.wechatLogin(code);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception e) {
            log.error("微信登录失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.INTERNAL_SERVER_ERROR.value()),
                            MapUtils.Pair.of("message", "登录失败"),
                            MapUtils.Pair.of("error", e.getMessage())
                    )
            );
        }
    }

    // 验证 token
    @PostMapping("/validate-token")
    @Operation(summary = "验证 token", description = "验证 token")
    public ResponseEntity<?> validateToken(
            @Parameter(
                    description = "token",
                    required = true
            )
            @RequestHeader("Authorization")
            String token
    ) {
        log.info("验证 token: token={}", token);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("error", "token 不能为空")
                    )
            );
        }

        try {
            boolean isValid = wechatAuthServer.validateToken(token);
            log.info("验证 token 结果: isValid={}", isValid);

            Map<String, Object> result = new HashMap<>();
            result.put("isValid", isValid);
            if (isValid) {
                String userId = wechatAuthServer.getUserIdFromToken(token);
                result.put("userId", userId);
            }
            result.put("code", HttpStatus.OK.value());
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception e) {
            log.error("验证 token 失败", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.UNAUTHORIZED.value()),
                            MapUtils.Pair.of("message", "token 验证失败"),
                            MapUtils.Pair.of("error", e.getMessage())
                    )
            );
        }
    }

    // 上传头像
    @PostMapping("/upload-avatar")
    @Operation(summary = "上传头像", description = "上传头像")
    public ResponseEntity<?> uploadAvatar(
            @Parameter(
                    description = "头像",
                    required = true
            )
            @RequestParam("avatar")
            MultipartFile file,
            @Parameter(
                    description = "request",
                    required = true
            )
            HttpServletRequest request
    ) throws IOException {
        try {
            // 验证 token
            String token = request.getHeader("Authorization");
            log.info("上传头像: token={}", token);
            if (!wechatAuthServer.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        MapUtils.of(
                                MapUtils.Pair.of("code", HttpStatus.UNAUTHORIZED.value()),
                                MapUtils.Pair.of("message", "token 验证失败"),
                                MapUtils.Pair.of("error", "token 无效")
                        )
                );
            }

            String openId = wechatAuthServer.getUserIdFromToken(token);
            log.info("上传头像: openId={}", openId);

            // 验证文件
            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        MapUtils.of(
                                MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                                MapUtils.Pair.of("message", "文件不能为空")
                        )
                );
            }

            // 验证文件类型
            String contentType = file.getContentType();
            if (contentType != null && !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        MapUtils.of(
                                MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                                MapUtils.Pair.of("message", "只能上传图片"),
                                MapUtils.Pair.of("error", "文件类型错误")
                        )
                );
            }

            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = "avatar_" + openId + "_" + System.currentTimeMillis() + fileExtension;

            // 创建目录
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            // 保存文件
            File destFile = new File(uploadPath, fileName);
            file.transferTo(destFile);

            // 生成访问地址
            String avatarUrl = accessUrl + fileName;

            // 更新用户头像
            wechatAuthServer.updateAvatar(openId, avatarUrl);

            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "上传成功"),
                            MapUtils.Pair.of("avatarUrl", avatarUrl)
                    )
            );
        } catch (Exception e) {
            log.error("上传头像失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.INTERNAL_SERVER_ERROR.value()),
                            MapUtils.Pair.of("message", "上传头像失败"),
                            MapUtils.Pair.of("error", e.getMessage())
                    )
            );
        }
    }

    // 更新用户信息
    @PostMapping("/update-info")
    @Operation(summary = "更新用户信息", description = "更新用户信息")
    public ResponseEntity<?> updateInfo(
            @Parameter(
                    description = "request",
                    required = true
            )
            @RequestBody WeChatAuthDTO weChatAuthDTO,
            @Parameter(
                    description = "httpRequest",
                    required = true
            )
            HttpServletRequest request
    ) {
        try {
            String token = request.getHeader("Authorization");
            String openId = wechatAuthServer.getUserIdFromToken(token);

            // 更新用户信息
            WeChatAuthDTO user = wechatAuthServer.updateUserInfo(openId, weChatAuthDTO);

            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "更新成功"),
                            MapUtils.Pair.of("userInfo", user)
                    )
            );
        } catch (Exception e) {
            log.error("更新用户信息失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.INTERNAL_SERVER_ERROR.value()),
                            MapUtils.Pair.of("message", "更新用户信息失败"),
                            MapUtils.Pair.of("error", e.getMessage())
                    )
            );
        }
    }
}

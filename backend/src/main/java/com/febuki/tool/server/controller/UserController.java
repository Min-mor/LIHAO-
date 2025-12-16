package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.LoginDTO;
import com.febuki.tool.server.dto.PasswordUpdateDTO;
import com.febuki.tool.server.service.impl.UserServerImpl;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@Tag(name = "用户管理", description = "用户管理接口")
public class UserController {

    private final UserServerImpl userServer;

    public UserController(UserServerImpl userServer) {
        this.userServer = userServer;
    }

    private String convertErrorMessage(String errorCode) {
        if (errorCode == null) return "未知错误";
        switch (errorCode) {
            case "USERNAME_NULL":
                return "用户名不能为空";
            case "PASSWORD_NULL":
                return "密码不能为空";
            case "TEL_NULL":
                return "手机号不能为空";
            case "PASSWORD_TOO_SHORT":
                return "密码长度不能少于6位";
            case "USERNAME_EXIST":
                return "操作失败：用户名已存在";
            case "TEL_EXIST":
                return "操作失败：手机号已被注册";
            case "EMAIL_EXIST":
                return "操作失败：邮箱已被注册";
            case "ROLE_INVALID":
                return "注册失败：无效的角色";
            case "ADMIN_REGISTER_FORBIDDEN":
                return "注册失败：禁止注册管理员账号";
            case "USER_NOT_FOUND":
                return "操作失败：用户不存在";
            case "PASSWORD_ERROR":
                return "登录失败：密码错误";
            case "ACCOUNT_BANNED":
                return "登录失败：账户已被封禁，请联系管理员";
            case "STATUS_NO_CHANGE":
                return "操作失败：用户状态已是目标状态，无需重复操作";
            case "OLD_PASSWORD_REQUIRED":
                return "修改失败：当前账户已设置密码，请输入旧密码";
            case "OLD_PASSWORD_ERROR":
                return "修改失败：旧密码错误";
            default:
                return "操作失败: " + errorCode;
        }
    }

    @GetMapping("/All")
    @Operation(summary = "获取所有用户(分页)", description = "分页获取所有用户")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", userServer.getAllUsers(page, limit))
                )
        );
    }

    @GetMapping("/getById/{id}")
    @Operation(summary = "根据ID获取用户", description = "获取用户")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("data", userServer.getUserById(id))
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.NOT_FOUND.value()),
                            MapUtils.Pair.of("message", convertErrorMessage(e.getMessage()))
                    )
            );
        }
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "使用手机号和密码登录")
    public ResponseEntity<?> login(@Validated @RequestBody LoginDTO loginDTO) {
        try {
            Map<String, Object> result = userServer.loginByTel(loginDTO.getTel(), loginDTO.getPassword());
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "登录成功"),
                            MapUtils.Pair.of("data", result)
                    )
            );
        } catch (RuntimeException e) {
            HttpStatus status = "ACCOUNT_BANNED".equals(e.getMessage()) ? HttpStatus.FORBIDDEN : HttpStatus.UNAUTHORIZED;
            return ResponseEntity.status(status).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", status.value()),
                            MapUtils.Pair.of("message", convertErrorMessage(e.getMessage()))
                    )
            );
        }
    }

    @PutMapping("/password")
    @Operation(summary = "修改密码", description = "修改当前登录用户的密码")
    public ResponseEntity<?> updatePassword(
            @Validated @RequestBody PasswordUpdateDTO passwordDTO,
            HttpServletRequest request
    ) {
        // 校验两次新密码是否一致
        if (!passwordDTO.getNewPassword().equals(passwordDTO.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("message", "两次输入的新密码不一致")
                    )
            );
        }

        // 从请求属性中获取当前登录用户的ID (由拦截器设置)
        String userIdStr = (String) request.getAttribute("userId");
        if (userIdStr == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.UNAUTHORIZED.value()),
                            MapUtils.Pair.of("message", "未登录或登录失效")
                    )
            );
        }
        Long userId = Long.parseLong(userIdStr);

        try {
            userServer.updatePassword(userId, passwordDTO.getOldPassword(), passwordDTO.getNewPassword());
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "密码修改成功")
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("message", convertErrorMessage(e.getMessage()))
                    )
            );
        }
    }

    @PutMapping("/status/{id}")
    @Operation(summary = "封禁/解封用户", description = "修改用户状态 (管理员权限)")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @Parameter(description = "true:正常, false:封禁") @RequestParam boolean status
    ) {
        try {
            userServer.updateUserStatus(id, status);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", status ? "已解封" : "已封禁")
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("message", convertErrorMessage(e.getMessage()))
                    )
            );
        }
    }
}

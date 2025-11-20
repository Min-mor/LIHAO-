package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.LoginDTO;
import com.febuki.tool.server.dto.RegisterDTO;
import com.febuki.tool.server.dto.UserDTO;
import com.febuki.tool.server.interceptor.IgnoreAuth;
import com.febuki.tool.server.service.impl.UserServerImpl;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@Tag(name = "用户管理", description = "用户管理接口")
public class UserController {

    private final UserServerImpl userServer;

    public UserController(UserServerImpl userServer) {
        this.userServer = userServer;
    }

    @GetMapping("/All")
    @Operation(summary = "获取所有用户", description = "获取所有用户")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", userServer.getAllUsers())
                )
        );
    }

    @GetMapping("/list/page/{page}")
    @Operation(summary = "分页获取用户列表", description = "分页获取用户列表")
    public ResponseEntity<?> getListPageUser(
            @Parameter(
                    description = "页码",
                    example = "1"
            )
            @PathVariable int page,
            @Parameter(
                    description = "每页数量",
                    example = "10"
            )
            @RequestParam(required = false, defaultValue = "10")
            int limit
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", userServer.listPageUser(page, limit))
                )
        );
    }

    @GetMapping("/getById/{id}")
    @Operation(summary = "根据ID获取用户", description = "获取用户")
    public ResponseEntity<?> getUserById(
            @Parameter(
                    description = "用户ID",
                    example = "1"
            )
            @PathVariable Long id
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", userServer.getUserById(id))
                )
        );
    }

    @PostMapping("/add")
    @Operation(summary = "添加用户", description = "添加用户")
    public ResponseEntity<?> addUser(
            @Parameter(
                    description = "用户信息",
                    required = true
            )
            @RequestBody UserDTO userDTO
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "添加成功"),
                        MapUtils.Pair.of("data", userDTO)
                )
        );
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "新用户注册接口")
    public ResponseEntity<?> register(
            @Parameter(description = "注册信息", required = true)
            @Validated @RequestBody RegisterDTO registerDTO
    ) {
        try {
            // 验证两次密码是否一致
            if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        MapUtils.of(
                                MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                                MapUtils.Pair.of("message", "两次密码不一致")
                        )
                );
            }

            // 转换为 UserDTO
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(registerDTO.getUsername());
            userDTO.setPassword(registerDTO.getPassword());
            userDTO.setNickname(registerDTO.getNickname());
            userDTO.setTel(registerDTO.getTel());
            userDTO.setAvatar(registerDTO.getAvatar());
            userDTO.setRole(registerDTO.getRole());

            // 执行注册
            userServer.registerUser(userDTO);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.CREATED.value()),
                            MapUtils.Pair.of("message", "注册成功")
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("message", e.getMessage())
                    )
            );
        }
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "使用手机号和密码登录")
    @IgnoreAuth
    public ResponseEntity<?> login(
            @Parameter(description = "登录信息", required = true)
            @Validated @RequestBody LoginDTO loginDTO
    ) {
        try {
            // 调用登录服务
            Map<String, Object> result = userServer.loginByTel(loginDTO.getTel(), loginDTO.getPassword());

            // 登录成功，返回Token和用户信息
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "登录成功"),
                            MapUtils.Pair.of("data", result) // result 包含 token, userInfo, expiresIn
                    )
            );
        } catch (RuntimeException e) {
            // 登录失败（手机号错误、密码错误、账户禁用等）
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("message", e.getMessage())
                    )
            );
        }
    }

    @GetMapping("/check/username/{username}")
    @Operation(summary = "检查用户名是否存在", description = "用于注册时验证用户名")
    public ResponseEntity<?> checkUsername(
            @Parameter(description = "用户名", example = "johndoe")
            @PathVariable String username
    ) {
        boolean exists = userServer.existsByUsername(username);
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", exists ? "用户名已存在" : "用户名可用"),
                        MapUtils.Pair.of("data", MapUtils.of(
                                MapUtils.Pair.of("exists", exists)
                        ))
                )
        );
    }
}

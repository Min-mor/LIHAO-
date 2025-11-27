package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.MerchantDTO;
import com.febuki.tool.server.service.MerchantServer;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/merchant")
@Tag(name = "商户管理", description = "商户管理接口")
public class MerchantController {

    private final MerchantServer merchantServer;

    public MerchantController(MerchantServer merchantServer) {
        this.merchantServer = merchantServer;
    }

    private String convertErrorMessage(String errorCode) {
        if (errorCode == null) return "未知错误";
        switch (errorCode) {
            case "USER_ID_NULL":
                return "用户ID不能为空";
            case "USER_NOT_FOUND":
                return "入驻失败：用户ID不存在";
            case "USER_ROLE_NOT_MERCHANT":
                return "入驻失败：该用户角色不是商家，无法入驻";
            case "MERCHANT_ALREADY_EXISTS":
                return "入驻失败：该用户已经是商户，请勿重复入驻";
            case "COMPANY_NAME_NULL":
                return "商户名称不能为空";
            case "COMPANY_NAME_DUPLICATE":
                return "操作失败：商户名称已存在，请使用其他名称";
            case "MERCHANT_ID_NULL":
                return "商户ID不能为空";
            case "MERCHANT_NOT_FOUND":
                return "操作失败：商户信息不存在";
            case "APPROVER_NOT_FOUND":
                return "操作失败：指定的审核人不存在";
            case "USER_ROLE_NOT_ADMIN":
                return "操作失败：审核人必须拥有管理员权限";
            case "MERCHANT_HAS_PRODUCTS":
                return "删除失败：该商户名下还有商品，请先下架或删除所有商品";
            default:
                return "操作失败: " + errorCode;
        }
    }

    @PostMapping("/add")
    @Operation(summary = "添加商户", description = "添加商户")
    public ResponseEntity<?> addMerchant(@RequestBody MerchantDTO merchantDTO) {
        try {
            merchantServer.saveMerchant(merchantDTO);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "添加成功"),
                            MapUtils.Pair.of("data", merchantDTO)
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

    @GetMapping("/list")
    @Operation(summary = "商户列表", description = "获取商户列表")
    public ResponseEntity<?> list(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false) String name
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", merchantServer.listMerchants(page, limit, name))
                )
        );
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "商户详情", description = "获取商户详情")
    public ResponseEntity<?> getDetail(@PathVariable Long id) {
        Object merchant = merchantServer.getMerchantById(id);
        if (merchant == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.NOT_FOUND.value()),
                            MapUtils.Pair.of("message", "商户不存在")
                    )
            );
        }
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", merchant)
                )
        );
    }

    @PutMapping("/update")
    @Operation(summary = "更新商户", description = "更新商户信息")
    public ResponseEntity<?> update(@RequestBody MerchantDTO merchantDTO) {
        try {
            merchantServer.updateMerchant(merchantDTO);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "更新成功")
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

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "删除商户", description = "删除商户")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            merchantServer.deleteMerchant(id);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "删除成功")
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
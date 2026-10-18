package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.TravelerDTO;
import com.febuki.tool.server.entity.Traveler;
import com.febuki.tool.server.service.TravelerServer;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/traveler")
@Tag(name = "旅客管理", description = "旅客管理接口")
public class TravelerController {
    private final TravelerServer travelerServer;

    public TravelerController(TravelerServer travelerServer) {
        this.travelerServer = travelerServer;
    }

    private String convertErrorMessage(String errorCode) {
        if (errorCode == null) return "未知错误";
        switch (errorCode) {
            case "USER_NOT_FOUND":
                return "操作失败：关联的用户不存在";
            case "TRAVELER_ID_NULL":
                return "操作失败：旅客ID不能为空";
            case "TRAVELER_NOT_FOUND":
                return "操作失败：该旅客信息不存在";
            default:
                return "操作失败: " + errorCode;
        }
    }

    @PostMapping("/add")
    @Operation(summary = "添加游客", description = "添加游客")
    public ResponseEntity<?> addTraveler(@Validated @RequestBody TravelerDTO travelerDTO) {
        try {
            travelerServer.saveTraveler(travelerDTO);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "添加成功")
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

    @PutMapping("/update")
    @Operation(summary = "更新游客", description = "更新游客信息")
    public ResponseEntity<?> updateTraveler(@Validated @RequestBody TravelerDTO travelerDTO) {
        try {
            travelerServer.updateTraveler(travelerDTO);
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
    @Operation(summary = "删除游客", description = "根据ID删除游客")
    public ResponseEntity<?> deleteTraveler(@PathVariable Long id) {
        try {
            travelerServer.deleteTraveler(id);
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

    @GetMapping("/list")
    @Operation(summary = "游客列表", description = "分页获取游客列表")
    public ResponseEntity<?> list(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @Parameter(description = "用户ID，不传则查所有（需管理员权限，此处暂略）")
            @RequestParam(required = false) Long userId
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", travelerServer.listTravelers(page, limit, userId))
                )
        );
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "游客详情", description = "根据ID获取游客详情")
    public ResponseEntity<?> getDetail(@PathVariable Long id) {
        Traveler traveler = travelerServer.getTravelerById(id);
        if (traveler == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.NOT_FOUND.value()),
                            MapUtils.Pair.of("message", "旅客信息不存在")
                    )
            );
        }
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", traveler)
                )
        );
    }
}

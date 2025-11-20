package com.febuki.tool.server.controller;

import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/order/items")
@Tag(name = "订单项接口", description = "订单项接口")
public class OrderItemController {

    @GetMapping("/list")
    @Operation(summary = "订单项列表", description = "订单项列表")
    public ResponseEntity<?> list(
            @Parameter(
                    description = "页码",
                    example = "1"
            )
            @Valid @RequestParam(required = false, defaultValue = "1") int page,
            @Parameter(
                    description = "每页数量",
                    example = "10"
            )
            @Valid @RequestParam(required = false, defaultValue = "10") int limit
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "成功"),
                        MapUtils.Pair.of("total", 0),
                        MapUtils.Pair.of("page", page),
                        MapUtils.Pair.of("limit", limit),
                        MapUtils.Pair.of("data", "{}")
                )
        );
    }
}

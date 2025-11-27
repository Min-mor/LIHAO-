package com.febuki.tool.server.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.febuki.tool.server.dto.OrderItemDTO;
import com.febuki.tool.server.service.OrderItemServer;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order/items")
@Tag(name = "订单项接口", description = "订单项接口")
public class OrderItemController {

    private final OrderItemServer orderItemServer;

    public OrderItemController(OrderItemServer orderItemServer) {
        this.orderItemServer = orderItemServer;
    }

    private String convertErrorMessage(String errorCode) {
        if (errorCode == null) return "未知错误";
        if (errorCode.equals("ORDER_ITEM_NOT_FOUND")) {
            return "操作失败：该订单项不存在或已被删除";
        }
        return "操作失败: " + errorCode;
    }

    @GetMapping("/list")
    @Operation(summary = "订单项列表", description = "订单项列表")
    public ResponseEntity<?> list(
            @Parameter(description = "页码")
            @RequestParam(required = false, defaultValue = "1") int page,

            @Parameter(description = "每页数量")
            @RequestParam(required = false, defaultValue = "10") int limit
    ) {
        IPage<OrderItemDTO> result = orderItemServer.listOrderItems(page, limit);
        
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", result)
                )
        );
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "删除订单项", description = "根据ID删除订单项")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            orderItemServer.deleteOrderItem(id);
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

    @GetMapping("/detail/{id}")
    @Operation(summary = "订单项详情", description = "获取单个订单项详情")
    public ResponseEntity<?> getDetail(@PathVariable Long id) {
        Object item = orderItemServer.getOrderItemById(id);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.NOT_FOUND.value()),
                            MapUtils.Pair.of("message", "订单项不存在")
                    )
            );
        }
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", item)
                )
        );
    }
}

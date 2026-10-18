package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.OrderDTO;
import com.febuki.tool.server.service.OrderServer;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@Tag(name = "订单管理", description = "订单管理接口")
public class OrderController {

    private final OrderServer orderServer;

    public OrderController(OrderServer orderServer) {
        this.orderServer = orderServer;
    }

    private String convertErrorMessage(String errorCode) {
        if (errorCode == null) return "未知错误";
        switch (errorCode) {
            case "USER_ID_NULL":
                return "下单用户ID不能为空";
            case "USER_NOT_FOUND":
                return "下单失败：用户不存在";
            case "PRODUCT_ID_NULL":
                return "商品ID不能为空";
            case "PRODUCT_NOT_FOUND":
                return "下单失败：商品不存在";
            case "PRODUCT_OFF_SHELF":
                return "下单失败：商品已下架或停止售卖";
            case "PRODUCT_OUT_OF_STOCK":
                return "下单失败：商品库存不足";
            case "ORDER_ID_NULL":
                return "订单ID不能为空";
            case "ORDER_NOT_FOUND":
                return "操作失败：订单不存在";
            case "OrderSN_EXIST":
                return "下单失败：订单码已存在";
            case "ORDER_ALREADY_PAID":
                return "操作失败：订单已支付，请勿重复支付";
            case "ORDER_NOT_PAID":
                return "操作失败：订单未支付";
            case "ORDER_STATUS_ERROR":
                return "操作失败：订单状态不符合操作要求";
            default:
                return "操作失败: " + errorCode;
        }
    }

    @PostMapping("/add")
    @Operation(summary = "添加订单", description = "创建新订单")
    public ResponseEntity<?> addOrder(@RequestBody OrderDTO orderDTO) {
        try {
            orderServer.createOrder(orderDTO);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "下单成功"),
                            MapUtils.Pair.of("data", orderDTO)
                    )
            );
        } catch (RuntimeException e) {
            String errorMsg = convertErrorMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("message", errorMsg)
                    )
            );
        }
    }

    @GetMapping("/list")
    @Operation(summary = "订单列表", description = "分页获取订单列表")
    public ResponseEntity<?> list(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", orderServer.listOrders(page, limit))
                )
        );
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "订单详情", description = "根据ID获取订单")
    public ResponseEntity<?> getDetail(@PathVariable Long id) {
        Object order = orderServer.getOrderById(id);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.NOT_FOUND.value()),
                            MapUtils.Pair.of("message", "订单不存在")
                    )
            );
        }
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", order)
                )
        );
    }

    @PostMapping("/pay/{id}")
    @Operation(summary = "支付订单", description = "模拟支付操作")
    public ResponseEntity<?> payOrder(@PathVariable Long id) {
        try {
            orderServer.payOrder(id);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "支付成功"),
                            MapUtils.Pair.of("data", orderServer.getOrderById(id))
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

    @PostMapping("/confirm/{id}")
    @Operation(summary = "确认收货/消费", description = "将订单状态从'未完成'改为'待评价'")
    public ResponseEntity<?> confirmOrder(@PathVariable Long id) {
        try {
            orderServer.confirmOrder(id);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "确认成功，订单待评价"),
                            MapUtils.Pair.of("data", orderServer.getOrderById(id))
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

    @PostMapping("/complete/{id}")
    @Operation(summary = "完成订单", description = "将订单状态从'待评价'改为'已完成' (通常在评价后调用)")
    public ResponseEntity<?> completeOrder(@PathVariable Long id) {
        try {
            orderServer.completeOrder(id);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "订单已完成"),
                            MapUtils.Pair.of("data", orderServer.getOrderById(id))
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

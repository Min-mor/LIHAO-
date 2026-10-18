package com.febuki.tool.server.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.febuki.tool.server.dto.OrderDTO;
import com.febuki.tool.server.entity.Order;

public interface OrderServer {
    // 添加订单
    Order createOrder(OrderDTO orderDTO);

    // 分页获取订单
    IPage<OrderDTO> listOrders(int page, int limit);

    // 获取订单详情
    Order getOrderById(Long id);

    // 支付订单
    void payOrder(Long id);

    // 确认订单 (状态流转: 未完成 -> 待评价)
    void confirmOrder(Long id);

    // 完成订单 (状态流转: 待评价 -> 已完成)
    void completeOrder(Long id);
}

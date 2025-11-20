package com.febuki.tool.server.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.febuki.tool.server.dto.OrderDTO;
import com.febuki.tool.server.entity.Order;

public interface OrderServer {
    // 添加订单
    void createOrder(OrderDTO orderDTO);
    // 分页获取订单 (可筛选用户ID)
    IPage<Order> listOrders(int page, int limit, Long userId);
    // 获取订单详情
    Order getOrderById(Long id);
    // 更新订单
//    void updateOrder(OrderDTO orderDTO);
    // 删除订单
    void deleteOrder(Long id);
}

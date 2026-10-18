package com.febuki.tool.server.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.febuki.tool.server.dto.OrderItemDTO;
import com.febuki.tool.server.entity.OrderItem;

public interface OrderItemServer {
    // 删除订单项
    void deleteOrderItem(Long id);

    // 根据ID获取详情
    OrderItem getOrderItemById(Long id);

    // 分页获取列表
    IPage<OrderItemDTO> listOrderItems(int page, int limit);
}

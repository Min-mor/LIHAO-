package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.OrderItemDTO;
import com.febuki.tool.server.entity.OrderItem;
import com.febuki.tool.server.mapper.OrderItemMapper;
import com.febuki.tool.server.service.OrderItemServer;
import org.springframework.stereotype.Service;

@Service("orderItemServer")
public class OrderItemServerImpl extends ServiceImpl<OrderItemMapper, OrderItem> implements OrderItemServer {

    @Override
    public void deleteOrderItem(Long id) {
        if (baseMapper.selectById(id) == null) {
            throw new RuntimeException("ORDER_ITEM_NOT_FOUND");
        }
        baseMapper.deleteById(id);
    }

    @Override
    public OrderItem getOrderItemById(Long id) {
        return baseMapper.selectById(id);
    }

    @Override
    public IPage<OrderItemDTO> listOrderItems(int page, int limit) {
        return baseMapper.selectPage(
                new Page<>(page, limit),
                new QueryWrapper<>()
        ).convert(
                orderItem -> new OrderItemDTO(
                        orderItem.getId(),
                        orderItem.getOrderId(),
                        orderItem.getProductId(),
                        orderItem.getProductTitle(),
                        orderItem.getUnitPrice(),
                        orderItem.getQuantity()
                )
        ).setTotal(
                baseMapper.selectCount(null)
        );
    }
}

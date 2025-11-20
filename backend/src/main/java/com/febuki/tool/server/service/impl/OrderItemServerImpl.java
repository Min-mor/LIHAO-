package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.entity.OrderItem;
import com.febuki.tool.server.mapper.OrderItemMapper;
import com.febuki.tool.server.service.OrderItemServer;
import org.springframework.stereotype.Service;

@Service("orderItemServer")
public class OrderItemServerImpl extends ServiceImpl<OrderItemMapper, OrderItem> implements OrderItemServer {
}

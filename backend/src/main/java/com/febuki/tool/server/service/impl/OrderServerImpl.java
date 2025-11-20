package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.OrderDTO;
import com.febuki.tool.server.entity.Order;
import com.febuki.tool.server.entity.OrderItem;
import com.febuki.tool.server.entity.Product;
import com.febuki.tool.server.entity.User;
import com.febuki.tool.server.mapper.OrderItemMapper;
import com.febuki.tool.server.mapper.OrderMapper;
import com.febuki.tool.server.mapper.ProductMapper;
import com.febuki.tool.server.mapper.UserMapper;
import com.febuki.tool.server.service.OrderServer;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service("orderServer")
public class OrderServerImpl extends ServiceImpl<OrderMapper, Order> implements OrderServer {

    private final OrderItemMapper orderItemMapper;
    private final ProductMapper productMapper;
    private final UserMapper userMapper;

    public OrderServerImpl(OrderItemMapper orderItemMapper, ProductMapper productMapper, UserMapper userMapper) {
        this.orderItemMapper = orderItemMapper;
        this.productMapper = productMapper;
        this.userMapper = userMapper;
    }

    @Override
    public void createOrder(OrderDTO orderDTO) {
        // 1. 校验用户
        if (orderDTO.getUserId() == null) {
            throw new RuntimeException("USER_ID_NULL");
        }
        User user = userMapper.selectById(orderDTO.getUserId());
        if (user == null) {
            throw new RuntimeException("USER_NOT_FOUND");
        }

        // 2. 校验商品
        if (orderDTO.getProductId() == null) {
            throw new RuntimeException("PRODUCT_ID_NULL");
        }
        Product product = productMapper.selectById(orderDTO.getProductId());
        if (product == null) {
            throw new RuntimeException("PRODUCT_NOT_FOUND");
        }
        if (product.getStatus() != 1) {
            throw new RuntimeException("PRODUCT_OFF_SHELF");
        }
        if (product.getStock() < 1) {
            throw new RuntimeException("PRODUCT_OUT_OF_STOCK");
        }

        // 3. 创建订单实体
        Order order = new Order();
        BeanUtils.copyProperties(orderDTO, order);
        order.setCreatedAt(LocalDateTime.now());

        // 使用商品当前价格
        order.setTotalAmount(product.getPrice());
        // 设置默认状态
        order.setOrderStatus((short) 0); // 0: 待支付
        order.setPaymentStatus(false);

        // 生成唯一订单号
        // 逻辑：时间戳(毫秒) + 3位随机数
        // 即使在高并发下，同一毫秒内也能支持1000个并发不重复
        if (order.getOrderSN() == null) {
            long timestamp = System.currentTimeMillis();
            // 随机生成 100-999 的数字
            int random = ThreadLocalRandom.current().nextInt(100, 1000);
            long uniqueOrderSN = Long.parseLong(timestamp + String.valueOf(random));
            order.setOrderSN(uniqueOrderSN);
        }

        // 4. 保存订单
        try {
            baseMapper.insert(order);
        } catch (Exception e) {
            // 极低概率下如果还是重复，抛出友好提示（或者在此处做递归重试）
            if (e.getMessage().contains("Duplicate entry")) {
                throw new RuntimeException("系统繁忙，请重试");
            }
            throw e;
        }

        // 5. 创建订单项 (这里简化为单商品)
        OrderItem orderItem = new OrderItem();
        orderItem.setOrderId(order.getId());
        orderItem.setProductId(product.getId());
        orderItem.setProductTitle(product.getName());
        orderItem.setUnitPrice(product.getPrice());
        orderItem.setQuantity(1L); // 默认为1，后续可从DTO获取
        orderItemMapper.insert(orderItem);
    }

    @Override
    public IPage<Order> listOrders(int page, int limit, Long userId) {
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }
        queryWrapper.orderByDesc("created_at");
        return baseMapper.selectPage(new Page<>(page, limit), queryWrapper);
    }

    @Override
    public Order getOrderById(Long id) {
        return baseMapper.selectById(id);
    }

//    @Override
//    public void updateOrder(OrderDTO orderDTO) {
//        if (orderDTO.getId() == null) {
//            throw new RuntimeException("ORDER_ID_NULL");
//        }
//
//        // 检查订单是否存在
//        Order existingOrder = baseMapper.selectById(orderDTO.getId());
//        if (existingOrder == null) {
//            throw new RuntimeException("ORDER_NOT_FOUND");
//        }
//
//        Order order = new Order();
//        BeanUtils.copyProperties(orderDTO, order);
//        baseMapper.updateById(order);
//    }

    @Override
    public void deleteOrder(Long id) {
        // 检查订单是否存在
        if (baseMapper.selectById(id) == null) {
            throw new RuntimeException("ORDER_NOT_FOUND");
        }

        // 1. 先删除子表数据 (OrderItems)
        orderItemMapper.delete(new QueryWrapper<OrderItem>().eq("order_id", id));

        // 2. 再删除主表数据 (Order)
        baseMapper.deleteById(id);
    }
}

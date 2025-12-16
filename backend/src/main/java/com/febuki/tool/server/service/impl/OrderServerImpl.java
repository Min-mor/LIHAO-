package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.OrderDTO;
import com.febuki.tool.server.dto.enums.OrderStatus;
import com.febuki.tool.server.dto.enums.PaymentStatus;
import com.febuki.tool.server.dto.enums.UserRole;
import com.febuki.tool.server.entity.Order;
import com.febuki.tool.server.entity.OrderItem;
import com.febuki.tool.server.entity.Product;
import com.febuki.tool.server.entity.User;
import com.febuki.tool.server.mapper.OrderItemMapper;
import com.febuki.tool.server.mapper.OrderMapper;
import com.febuki.tool.server.mapper.ProductMapper;
import com.febuki.tool.server.mapper.UserMapper;
import com.febuki.tool.server.service.OrderServer;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
    public Order createOrder(OrderDTO orderDTO) {
        // 1. 参数校验
        if (orderDTO.getUserId() == null) throw new RuntimeException("USER_ID_NULL");
        if (orderDTO.getProductId() == null) throw new RuntimeException("PRODUCT_ID_NULL");
        int quantity = (orderDTO.getQuantity() == null || orderDTO.getQuantity() < 1) ? 1 : orderDTO.getQuantity();

        // 2. 校验用户和商品
        User user = userMapper.selectById(orderDTO.getUserId());
        if (user == null) throw new RuntimeException("USER_NOT_FOUND");

        Product product = productMapper.selectById(orderDTO.getProductId());
        if (product == null) throw new RuntimeException("PRODUCT_NOT_FOUND");
        if (!product.isStatus()) throw new RuntimeException("PRODUCT_OFF_SHELF");
        if (product.getStock() < quantity) throw new RuntimeException("PRODUCT_OUT_OF_STOCK");

        // 3. 扣减库存
        product.setStock(product.getStock() - quantity);
        if (productMapper.updateById(product) < 1) {
            throw new RuntimeException("SYSTEM_BUSY");
        }

        // 4. 创建订单主表
        Order order = new Order();
        order.setUserId(user.getId());
        order.setProductId(product.getId());
        order.setCreatedAt(LocalDateTime.now());
        order.setTotalAmount(product.getPrice().multiply(new BigDecimal(quantity)));
        order.setPaymentStatus(PaymentStatus.UNPAID.getCode());
        order.setOrderStatus(OrderStatus.UNFINISHED.getCode());

        // 生成唯一订单编号
        long timestamp = System.currentTimeMillis();
        int random = ThreadLocalRandom.current().nextInt(100, 1000);
        order.setOrderSN(Long.parseLong(timestamp + String.valueOf(random)));

        // 插入主表
        baseMapper.insert(order);

        // 5. 创建订单项 (OrderItems)
        OrderItem orderItem = new OrderItem();
        orderItem.setOrderId(order.getId());
        orderItem.setProductId(product.getId());
        orderItem.setProductTitle(product.getName()); // 快照：商品名
        orderItem.setUnitPrice(product.getPrice());   // 快照：下单价格
        orderItem.setQuantity((long) quantity);       // 核心：数量

        // 插入子表
        orderItemMapper.insert(orderItem);

        return order;
    }

    @Override
    public IPage<OrderDTO> listOrders(int page, int limit, Long userId) {
        // 1. 查找当前操作用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("USER_NOT_FOUND");
        }

        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        // 默认按创建时间倒序
        queryWrapper.orderByDesc("o.created_at");
        // 2. 核心逻辑：根据角色区分查看视角
        if (UserRole.MERCHANT.getRoleName().equals(user.getRole())) {
            // 'p' 是 Mapper 中 products 表的别名
            queryWrapper.eq("p.user_id", userId);
        } else if (UserRole.CUSTOMER.getRoleName().equals(user.getRole())) {
            // 'o' 是 Mapper 中 orders 表的别名
            queryWrapper.eq("o.user_id", userId);
        }
        // 如果是管理员，则不加 where 条件，查看所有

        // 3. 执行自定义连表查询
        return baseMapper.selectOrderPage(new Page<>(page, limit), queryWrapper);
    }

    @Override
    public Order getOrderById(Long id) {
        return baseMapper.selectById(id);
    }

    @Override
    public void payOrder(Long id) {
        Order order = baseMapper.selectById(id);
        if (order == null) throw new RuntimeException("ORDER_NOT_FOUND");
        if (order.getPaymentStatus() == PaymentStatus.PAID.getCode()) {
            throw new RuntimeException("ORDER_ALREADY_PAID");
        }
        order.setPaymentStatus(PaymentStatus.PAID.getCode());
        baseMapper.updateById(order);
    }

    @Override
    public void confirmOrder(Long id) {
        Order order = baseMapper.selectById(id);
        if (order == null) throw new RuntimeException("ORDER_NOT_FOUND");

        // 只有"未完成"状态的订单才能确认（变成待评价）
        if (order.getOrderStatus() != OrderStatus.UNFINISHED.getCode()) {
            throw new RuntimeException("ORDER_STATUS_ERROR");
        }
        // 必须支付后才能确认
        if (order.getPaymentStatus() != PaymentStatus.PAID.getCode()) {
            throw new RuntimeException("ORDER_NOT_PAID");
        }

        order.setOrderStatus(OrderStatus.PENDING_EVALUATION.getCode()); // 1: 待评价
        baseMapper.updateById(order);
    }

    @Override
    public void completeOrder(Long id) {
        Order order = baseMapper.selectById(id);
        if (order == null) throw new RuntimeException("ORDER_NOT_FOUND");

        // 只有"待评价"状态的订单才能完成（评价后）
        if (order.getOrderStatus() != OrderStatus.PENDING_EVALUATION.getCode()) {
            throw new RuntimeException("ORDER_STATUS_ERROR");
        }

        order.setOrderStatus(OrderStatus.COMPLETED.getCode()); // 2: 已完成
        baseMapper.updateById(order);
    }
}

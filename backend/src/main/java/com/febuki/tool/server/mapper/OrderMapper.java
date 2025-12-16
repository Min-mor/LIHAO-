package com.febuki.tool.server.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.febuki.tool.server.dto.OrderDTO;
import com.febuki.tool.server.entity.Order;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

@Component
public interface OrderMapper extends BaseMapper<Order> {

    @Select("SELECT " +
            "o.order_id AS id, " +
            "o.order_sn AS orderSN, " +
            "o.user_id AS userId, " +
            "o.product_id AS productId, " +
            "o.total_amount AS totalAmount, " +
            "o.payment_status AS paymentStatus, " +
            "o.order_status AS orderStatus, " +
            "o.created_at AS createdAt, " +
            "oi.quantity AS quantity, " +
            "p.product_name AS productName, " +
            "u.nickname AS customerName, " +   // 买家昵称
            "m.company_name AS merchantName " + // 商家公司名
            "FROM orders o " +
            "LEFT JOIN order_items oi ON o.order_id = oi.order_id " +
            "LEFT JOIN products p ON o.product_id = p.product_id " +
            "LEFT JOIN users u ON o.user_id = u.user_id " +
            "LEFT JOIN merchants m ON p.user_id = m.user_id " +
            "${ew.customSqlSegment}")
    IPage<OrderDTO> selectOrderPage(IPage<OrderDTO> page, @Param(Constants.WRAPPER) Wrapper<Order> wrapper);
}

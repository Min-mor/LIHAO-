package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.ProductDTO;
import com.febuki.tool.server.dto.enums.UserRole;
import com.febuki.tool.server.entity.Merchant;
import com.febuki.tool.server.entity.Product;
import com.febuki.tool.server.entity.User;
import com.febuki.tool.server.mapper.MerchantMapper;
import com.febuki.tool.server.mapper.ProductMapper;
import com.febuki.tool.server.mapper.UserMapper;
import com.febuki.tool.server.service.ProductServer;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service("productServer")
public class ProductServerImpl extends ServiceImpl<ProductMapper, Product> implements ProductServer {

    private final MerchantMapper merchantMapper;
    private final UserMapper userMapper;

    public ProductServerImpl(MerchantMapper merchantMapper, UserMapper userMapper) {
        this.merchantMapper = merchantMapper;
        this.userMapper = userMapper;
    }

    @Override
    public IPage<ProductDTO> listProducts(int page, int limit, String keyword) {
        return baseMapper.selectPage(
                new Page<>(page, limit),
                new QueryWrapper<>()
        ).convert(
                product -> new ProductDTO(
                        product.getId(),
                        product.getName(),
                        product.getDestination(),
                        product.getPrice(),
                        product.getUserId(),
                        product.getDescription(),
                        product.getStock(),
                        product.isStatus(),
                        product.isHotelOrNo(),
                        product.getHotel()
                )
        ).setTotal(
                baseMapper.selectCount(null)
        );
    }

    @Override
    public Product getProductById(Long id) {
        return baseMapper.selectById(id);
    }

    @Override
    public void saveProduct(ProductDTO productDTO) {
        // 检查商品是否已存在
        if (productDTO.getId() != null) {
            Product existingProduct = baseMapper.selectById(productDTO.getId());
            if (existingProduct != null) {
                throw new RuntimeException("PRODUCT_ID_EXIST");
            }
        }
        // 基础校验
        if (productDTO.getUserId() == null) {
            throw new RuntimeException("USER_ID_NULL");
        }
        // 包含酒店时，酒店名不能为空
        if (productDTO.isHotelOrNo() && !StringUtils.hasText(productDTO.getHotel())) {
            throw new RuntimeException("HOTEL_NAME_REQUIRED");
        }
        // 检查商户资格
        Merchant merchant = merchantMapper.selectById(productDTO.getUserId());
        if (merchant == null) {
            throw new RuntimeException("MERCHANT_NOT_FOUND");
        }
        // 执行添加
        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);
        product.setHotelOrNo(productDTO.isHotelOrNo());
        product.setHotel(productDTO.isHotelOrNo() ? productDTO.getHotel() : null);
        product.setStatus(false);
        baseMapper.insert(product);
    }

    @Override
    public void updateProduct(ProductDTO productDTO) {
        // 1. 基础参数校验
        if (productDTO.getUserId() == null) {
            throw new RuntimeException("USER_ID_NULL");
        }

        // 2. 查找现有商品
        Product existingProduct = baseMapper.selectById(productDTO.getId());
        if (existingProduct == null) {
            throw new RuntimeException("PRODUCT_NOT_FOUND");
        }

        // 3. 权限校验逻辑
        // 获取操作者（传入的userId）
        User operator = userMapper.selectById(productDTO.getUserId());
        if (operator == null) {
            throw new RuntimeException("USER_NOT_FOUND");
        }

        // 判断是否是商品所有者（商家自己）
        boolean isOwner = existingProduct.getUserId().equals(operator.getId());
        // 判断是否是管理员
        boolean isAdmin = UserRole.ADMIN.getRoleName().equals(operator.getRole());

        // 如果既不是所有者，也不是管理员，则禁止修改
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("NO_PERMISSION");
        }

        // 4. 业务逻辑校验
        if (productDTO.isHotelOrNo() && !StringUtils.hasText(productDTO.getHotel())) {
            throw new RuntimeException("HOTEL_NAME_REQUIRED");
        }

        // 5. 执行更新
        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);

        // 如果是管理员操作（且管理员不是所有者），需要保持原有的 user_id 不变
        // 否则 BeanUtils 会把 productDTO 中的 userId（管理员ID）覆盖到 product 中，导致商品易主
        if (isAdmin && !isOwner) {
            product.setUserId(existingProduct.getUserId());
        }

        product.setHotelOrNo(productDTO.isHotelOrNo());
        product.setHotel(productDTO.isHotelOrNo() ? productDTO.getHotel() : null);

        baseMapper.updateById(product);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = new Product();
        product.setId(id);
        product.setStatus(false);
        baseMapper.updateById(product);
    }
}

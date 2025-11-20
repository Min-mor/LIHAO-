package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.ProductDTO;
import com.febuki.tool.server.entity.Merchant;
import com.febuki.tool.server.entity.Product;
import com.febuki.tool.server.mapper.MerchantMapper;
import com.febuki.tool.server.mapper.ProductMapper;
import com.febuki.tool.server.service.ProductServer;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service("productServer")
public class ProductServerImpl extends ServiceImpl<ProductMapper, Product> implements ProductServer {

    private final MerchantMapper merchantMapper;
    public ProductServerImpl(MerchantMapper merchantMapper) {
        this.merchantMapper = merchantMapper;
    }

    @Override
    public IPage<Product> listProducts(int page, int limit, String keyword) {
        QueryWrapper<Product> queryWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            queryWrapper.like("product_name", keyword)
                    .or().like("destination_name", keyword);
        }
        return baseMapper.selectPage(new Page<>(page, limit), queryWrapper);
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
        // 检查商户资格
        Merchant merchant = merchantMapper.selectById(productDTO.getUserId());
        if (merchant == null) {
            throw new RuntimeException("MERCHANT_NOT_FOUND");
        }
        // 执行添加
        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);
        product.setStatus((short) 0);
        baseMapper.insert(product);
    }

    @Override
    public void updateProduct(ProductDTO productDTO) {
        Merchant merchant = merchantMapper.selectById(productDTO.getUserId());
        if (merchant == null) {
            throw new RuntimeException("MERCHANT_NOT_FOUND");
        }
        Product existingProduct = baseMapper.selectById(productDTO.getId());
        if (existingProduct == null) {
            throw new RuntimeException("PRODUCT_NOT_FOUND");
        }

        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);
        baseMapper.updateById(product);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = new Product();
        product.setId(id);
        // 假设 status: 1=正常, 0=下架。
        // 这里我们将状态改为 0 代表已删除
        product.setStatus((short) 0);
        baseMapper.updateById(product);
    }
}

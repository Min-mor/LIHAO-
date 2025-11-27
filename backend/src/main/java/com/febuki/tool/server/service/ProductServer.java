package com.febuki.tool.server.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.febuki.tool.server.dto.ProductDTO;
import com.febuki.tool.server.entity.Product;

public interface ProductServer {
    // 分页获取商品
    IPage<ProductDTO> listProducts(int page, int limit, String keyword);
    // 根据ID获取商品
    Product getProductById(Long id);
    // 添加商品
    void saveProduct(ProductDTO productDTO);
    // 更新商品
    void updateProduct(ProductDTO productDTO);
    // 删除商品
    void deleteProduct(Long id);
}

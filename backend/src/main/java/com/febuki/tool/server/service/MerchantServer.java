package com.febuki.tool.server.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.febuki.tool.server.dto.MerchantDTO;
import com.febuki.tool.server.entity.Merchant;

public interface MerchantServer {
    // 添加商户
    void saveMerchant(MerchantDTO merchantDTO);

    // 分页获取商户
    IPage<MerchantDTO> listMerchants(int page, int limit, String name);

    // 根据ID获取商户
    Merchant getMerchantById(Long id);

    // 更新商户
    void updateMerchant(MerchantDTO merchantDTO);

    // 删除商户
    void deleteMerchant(Long id);
}

package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.MerchantDTO;
import com.febuki.tool.server.dto.enums.UserRole;
import com.febuki.tool.server.entity.Merchant;
import com.febuki.tool.server.entity.Product;
import com.febuki.tool.server.entity.User;
import com.febuki.tool.server.mapper.MerchantMapper;
import com.febuki.tool.server.mapper.ProductMapper;
import com.febuki.tool.server.mapper.UserMapper;
import com.febuki.tool.server.service.MerchantServer;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service("merchantServer")
public class MerchantServerImpl extends ServiceImpl<MerchantMapper, Merchant> implements MerchantServer {

    private final UserMapper userMapper;
    private final ProductMapper productMapper;

    public MerchantServerImpl(UserMapper userMapper, ProductMapper productMapper) {
        this.userMapper = userMapper;
        this.productMapper = productMapper;
    }

    @Override
    public void saveMerchant(MerchantDTO merchantDTO) {
        // 1. 校验 ID
        if (merchantDTO.getId() == null) {
            throw new RuntimeException("USER_ID_NULL");
        }

        // 2. 校验用户是否存在
        User user = userMapper.selectById(merchantDTO.getId());
        if (user == null) {
            throw new RuntimeException("USER_NOT_FOUND");
        }

        // 校验用户角色是否为 merchant
        if (!UserRole.MERCHANT.getRoleName().equals(user.getRole())) {
            throw new RuntimeException("USER_ROLE_NOT_MERCHANT");
        }

        // 3. 校验是否已入驻
        Merchant existingMerchant = baseMapper.selectById(merchantDTO.getId());
        if (existingMerchant != null) {
            throw new RuntimeException("MERCHANT_ALREADY_EXISTS");
        }

        // 4. 校验公司名是否重复
        if (StringUtils.hasText(merchantDTO.getCompanyName())) {
            Long count = Long.valueOf(baseMapper.selectCount(new QueryWrapper<Merchant>()
                    .eq("company_name", merchantDTO.getCompanyName())));
            if (count > 0) {
                throw new RuntimeException("COMPANY_NAME_DUPLICATE");
            }
        } else {
            throw new RuntimeException("COMPANY_NAME_NULL");
        }

        Merchant merchant = new Merchant();
        BeanUtils.copyProperties(merchantDTO, merchant);
        merchant.setVerificationStatus((short) 0);
        baseMapper.insert(merchant);
    }

    @Override
    public IPage<MerchantDTO> listMerchants(int page, int limit, String name) {
        return baseMapper.selectPage(
                new Page<>(page, limit),
                new QueryWrapper<>()
        ).convert(
                order -> new MerchantDTO(
                        order.getId(),
                        order.getCompanyName(),
                        order.getBusinessLicenseURL(),
                        order.getVerificationStatus(),
                        order.getApprovedBy()
                )
        ).setTotal(
                baseMapper.selectCount(null)
        );
    }

    @Override
    public Merchant getMerchantById(Long id) {
        return baseMapper.selectById(id);
    }

    @Override
    public void updateMerchant(MerchantDTO merchantDTO) {
        if (merchantDTO.getId() == null) {
            throw new RuntimeException("MERCHANT_ID_NULL");
        }

        Merchant existing = baseMapper.selectById(merchantDTO.getId());
        if (existing == null) {
            throw new RuntimeException("MERCHANT_NOT_FOUND");
        }

        // 如果修改了公司名，也需要检查重复（排除自己）
        if (StringUtils.hasText(merchantDTO.getCompanyName())
                && !merchantDTO.getCompanyName().equals(existing.getCompanyName())) {
            Long count = Long.valueOf(baseMapper.selectCount(new QueryWrapper<Merchant>()
                    .eq("company_name", merchantDTO.getCompanyName())));
            if (count > 0) {
                throw new RuntimeException("COMPANY_NAME_DUPLICATE");
            }
        }

        // 校验审核人权限
        if (merchantDTO.getApprovedBy() != null) {
            User approver = userMapper.selectById(merchantDTO.getApprovedBy());
            if (approver == null) {
                throw new RuntimeException("APPROVER_NOT_FOUND");
            }
            if (!UserRole.ADMIN.getRoleName().equals(approver.getRole())) {
                throw new RuntimeException("USER_ROLE_NOT_ADMIN");
            }
        }

        Merchant merchant = new Merchant();
        BeanUtils.copyProperties(merchantDTO, merchant);
        baseMapper.updateById(merchant);
    }

    @Override
    public void deleteMerchant(Long id) {
        if (baseMapper.selectById(id) == null) {
            throw new RuntimeException("MERCHANT_NOT_FOUND");
        }

        // 校验该商户下是否有商品
        Long productCount = Long.valueOf(productMapper.selectCount(new QueryWrapper<Product>().eq("user_id", id)));
        if (productCount > 0) {
            throw new RuntimeException("MERCHANT_HAS_PRODUCTS");
        }

        baseMapper.deleteById(id);
    }
}

package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.TravelerDTO;
import com.febuki.tool.server.dto.enums.UserRole;
import com.febuki.tool.server.entity.Traveler;
import com.febuki.tool.server.entity.User;
import com.febuki.tool.server.mapper.TraverlerMapper;
import com.febuki.tool.server.mapper.UserMapper;
import com.febuki.tool.server.service.TravelerServer;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service("TravelerServer")
public class TravelerServerImpl extends ServiceImpl<TraverlerMapper, Traveler> implements TravelerServer {
    private final UserMapper userMapper;

    public TravelerServerImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public void saveTraveler(TravelerDTO travelerDTO) {
        // 1. 检查旅客表中 user_id 是否重复
        Long userCount = Long.valueOf(baseMapper.selectCount(new QueryWrapper<Traveler>()
                .eq("user_id", travelerDTO.getUserId())));
        if (userCount > 0) {
            throw new RuntimeException("USER_ALREADY_HAS_TRAVELER");
        }

        // 2. 检查 users 表中的 role 是否为 customer
        User user = userMapper.selectById(travelerDTO.getUserId());
        if (user == null) {
            throw new RuntimeException("USER_NOT_FOUND");
        }
        if (!UserRole.CUSTOMER.getRoleName().equals(user.getRole())) {
            throw new RuntimeException("USER_ROLE_NOT_CUSTOMER");
        }

        // 3. 检查旅客表中 id_card_number 是否重复
        Long idCardCount = Long.valueOf(baseMapper.selectCount(new QueryWrapper<Traveler>()
                .eq("id_card_number", travelerDTO.getIdCardNumber())));
        if (idCardCount > 0) {
            throw new RuntimeException("ID_CARD_EXISTS");
        }

        // 4. 检查旅客表中 phone 是否重复
        Long phoneCount = Long.valueOf(baseMapper.selectCount(new QueryWrapper<Traveler>()
                .eq("phone", travelerDTO.getPhone())));
        if (phoneCount > 0) {
            throw new RuntimeException("PHONE_EXISTS");
        }

        // 5. 转换实体并保存
        Traveler traveler = new Traveler();
        BeanUtils.copyProperties(travelerDTO, traveler);
        baseMapper.insert(traveler);
    }

    @Override
    public void deleteTraveler(Long id) {
        if (baseMapper.selectById(id) == null) {
            throw new RuntimeException("TRAVELER_NOT_FOUND");
        }
        baseMapper.deleteById(id);
    }

    @Override
    public Traveler getTravelerById(Long id) {
        return baseMapper.selectById(id);
    }

    @Override
    public IPage<TravelerDTO> listTravelers(int page, int limit, Long userId) {
        // 1. 构建查询条件
        QueryWrapper<Traveler> queryWrapper = new QueryWrapper<>();
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }

        // 2. 执行分页查询 (selectPage 会自动处理 count 查询)
        return baseMapper.selectPage(
                new Page<>(page, limit),
                queryWrapper
        ).convert(
                traveler -> new TravelerDTO(
                        traveler.getId(),
                        traveler.getUserId(),
                        traveler.getFullName(),
                        traveler.getPhone(),
                        traveler.getIdCardType(),
                        traveler.getIdCardNumber(),
                        traveler.getTravelerType()
                )
        );
    }
}

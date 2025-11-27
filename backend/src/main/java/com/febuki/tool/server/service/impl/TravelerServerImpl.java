package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.TravelerDTO;
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
        // 1. 校验关联用户是否存在
        User user = userMapper.selectById(travelerDTO.getUserId());
        if (user == null) {
            throw new RuntimeException("USER_NOT_FOUND");
        }

        // 2. 转换实体并保存
        Traveler traveler = new Traveler();
        BeanUtils.copyProperties(travelerDTO, traveler);
        baseMapper.insert(traveler);
    }

    @Override
    public void updateTraveler(TravelerDTO travelerDTO) {
        // 1. 基础校验
        if (travelerDTO.getId() == null) {
            throw new RuntimeException("TRAVELER_ID_NULL");
        }

        // 2. 检查是否存在
        Traveler existingTraveler = baseMapper.selectById(travelerDTO.getId());
        if (existingTraveler == null) {
            throw new RuntimeException("TRAVELER_NOT_FOUND");
        }

        // 3. 转换实体并更新
        Traveler traveler = new Traveler();
        BeanUtils.copyProperties(travelerDTO, traveler);
        baseMapper.updateById(traveler);
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
        return baseMapper.selectPage(
                new Page<>(page, limit),
                new QueryWrapper<>()
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
        ).setTotal(
                baseMapper.selectCount(null)
        );
    }
}

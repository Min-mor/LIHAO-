package com.febuki.tool.server.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.febuki.tool.server.dto.TravelerDTO;
import com.febuki.tool.server.entity.Traveler;

public interface TravelerServer {
    // 添加游客
    void saveTraveler(TravelerDTO travelerDTO);

    // 更新游客
    void updateTraveler(TravelerDTO travelerDTO);

    // 删除游客
    void deleteTraveler(Long id);

    // 获取游客详情
    Traveler getTravelerById(Long id);

    // 分页获取游客列表 (可根据 userId 筛选)
    IPage<TravelerDTO> listTravelers(int page, int limit, Long userId);
}

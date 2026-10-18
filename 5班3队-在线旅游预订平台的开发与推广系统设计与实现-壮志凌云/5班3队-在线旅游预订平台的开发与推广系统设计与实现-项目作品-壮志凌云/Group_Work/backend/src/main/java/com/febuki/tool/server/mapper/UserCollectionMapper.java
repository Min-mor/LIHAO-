package com.febuki.tool.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.febuki.tool.server.entity.UserCollection;
import org.springframework.stereotype.Component;

@Component
public interface UserCollectionMapper extends BaseMapper<UserCollection> {
    UserCollection selectByUserIdAndProductId(Long userId, Long productId);
}

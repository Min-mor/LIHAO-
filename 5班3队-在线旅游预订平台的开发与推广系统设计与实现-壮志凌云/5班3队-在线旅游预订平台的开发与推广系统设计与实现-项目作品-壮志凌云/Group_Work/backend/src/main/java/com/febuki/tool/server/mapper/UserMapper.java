package com.febuki.tool.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.febuki.tool.server.entity.User;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

@Component
public interface UserMapper extends BaseMapper<User> {

}

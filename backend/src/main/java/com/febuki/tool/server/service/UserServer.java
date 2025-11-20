package com.febuki.tool.server.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.febuki.tool.server.dto.UserDTO;
import com.febuki.tool.server.entity.User;

import java.util.List;
import java.util.Map;

public interface UserServer {
    // 获取所有用户
    List<UserDTO> getAllUsers();
    //
    IPage<UserDTO> listPageUser(int page, int limit);
    // 根据ID获取单个用户
    User getUserById(Long id);
    // 创建用户
    void saveUser(User user);
    // 注册用户
    void registerUser(UserDTO userDTO);
    // 检查用户名是否存在
    boolean existsByUsername(String username);
    // 检查邮箱是否存在
    boolean existsByTel(String email);
    //手机登录
    Map<String, Object> loginByTel(String tel, String password);
    // 根据手机号查询用户
    User findByPhone(String tel);
}

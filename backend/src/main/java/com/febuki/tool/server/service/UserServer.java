package com.febuki.tool.server.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.febuki.tool.server.dto.UserDTO;
import com.febuki.tool.server.entity.User;

import java.util.List;
import java.util.Map;

public interface UserServer {
    // 分页获取用户
    IPage<UserDTO> getAllUsers(int page, int limit);

    // 根据ID获取用户实体
    User getUserById(Long id);

    // 检查字段唯一性
    boolean existsByUsername(String username);
    boolean existsByTel(String tel);
    boolean existsByEmail(String email);

    // 修改密码
    void updatePassword(Long userId, String oldPassword, String newPassword);

    // 更改用户状态 (封禁/解封)
    void updateUserStatus(Long userId, boolean status);

    // 手机号登录
    Map<String, Object> loginByTel(String tel, String password);

    // 根据手机寻找用户
    User findByPhone(String phone);

    // 保存用户
    void saveUser(User user);
}

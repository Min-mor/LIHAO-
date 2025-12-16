package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.UserDTO;
import com.febuki.tool.server.entity.User;
import com.febuki.tool.server.mapper.UserMapper;
import com.febuki.tool.server.service.UserServer;
import com.febuki.tool.server.utils.JwtTokenUtil;
import com.febuki.tool.server.utils.MapUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;

@Service("userServer")
public class UserServerImpl extends ServiceImpl<UserMapper, User> implements UserServer {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final JwtTokenUtil jwtTokenUtil;

    public UserServerImpl(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                null,
                user.getTel(),
                user.getEmail(),
                user.getRole(),
                user.getAvatar(),
                user.isStatus()
        );
    }

    @Override
    public IPage<UserDTO> getAllUsers(int page, int limit) {
        return baseMapper.selectPage(
                new Page<>(page, limit),
                new QueryWrapper<>()
        ).convert(this::convertToDTO);
    }

    @Override
    public User getUserById(Long id) {
        User user = baseMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("USER_NOT_FOUND");
        }
        return user;
    }

    @Override
    public boolean existsByUsername(String username) {
        return baseMapper.selectCount(new QueryWrapper<User>().eq("user_name", username)) > 0;
    }

    @Override
    public boolean existsByTel(String tel) {
        return baseMapper.selectCount(new QueryWrapper<User>().eq("tel", tel)) > 0;
    }

    @Override
    public boolean existsByEmail(String email) {
        return baseMapper.selectCount(new QueryWrapper<User>().eq("email", email)) > 0;
    }

    @Override
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = baseMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("USER_NOT_FOUND");
        }

        // 如果用户当前有密码，则必须验证旧密码
        if (StringUtils.hasText(user.getPassword())) {
            if (!StringUtils.hasText(oldPassword)) {
                throw new RuntimeException("OLD_PASSWORD_REQUIRED"); // 需要旧密码
            }
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new RuntimeException("OLD_PASSWORD_ERROR"); // 旧密码错误
            }
        }
        // 如果用户无密码，则直接设置新密码，无需旧密码验证

        user.setPassword(passwordEncoder.encode(newPassword));
        baseMapper.updateById(user);
    }

    @Override
    public void updateUserStatus(Long userId, boolean status) {
        User user = baseMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("USER_NOT_FOUND");
        }
        if (user.isStatus() == status) {
            throw new RuntimeException("STATUS_NO_CHANGE");
        }
        user.setStatus(status);
        baseMapper.updateById(user);
    }

    @Override
    public Map<String, Object> loginByTel(String tel, String password) {
        User user = baseMapper.selectOne(new QueryWrapper<User>().eq("tel", tel));

        if (user == null) throw new RuntimeException("USER_NOT_FOUND");
        if (!passwordEncoder.matches(password, user.getPassword())) throw new RuntimeException("PASSWORD_ERROR");
        if (!user.isStatus()) throw new RuntimeException("ACCOUNT_BANNED");

        Map<String, Object> result = MapUtils.of(
                MapUtils.Pair.of("userInfo", convertToDTO(user)),
                MapUtils.Pair.of("expiresIn", jwtTokenUtil.getExpiration())
        );
        String token = jwtTokenUtil.generateToken(user.getId(), result);
        return MapUtils.of(
                MapUtils.Pair.of("token", token),
                MapUtils.Pair.of("userInfo", convertToDTO(user)),
                MapUtils.Pair.of("expiresIn", jwtTokenUtil.getExpiration())
        );
    }

    @Override
    public User findByPhone(String phone) {
        return baseMapper.selectOne(new QueryWrapper<User>().eq("tel", phone));
    }

    @Override
    public void saveUser(User user) {
        // 检查字段唯一性
        if (existsByUsername(user.getUsername())) {
            throw new RuntimeException("USERNAME_EXISTS");
        }

        if (existsByTel(user.getTel())) {
            throw new RuntimeException("TEL_EXISTS");
        }

        if (existsByEmail(user.getEmail())) {
            throw new RuntimeException("EMAIL_EXISTS");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        baseMapper.insert(user);
    }
}

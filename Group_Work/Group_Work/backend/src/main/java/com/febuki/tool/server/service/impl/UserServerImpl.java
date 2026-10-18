package com.febuki.tool.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.febuki.tool.server.dto.UserDTO;
import com.febuki.tool.server.dto.enums.UserRole;
import com.febuki.tool.server.entity.User;
import com.febuki.tool.server.mapper.UserMapper;
import com.febuki.tool.server.service.UserServer;
import com.febuki.tool.server.utils.JwtTokenUtil;
import com.febuki.tool.server.utils.MapUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service("userServer")
public class UserServerImpl extends ServiceImpl<UserMapper, User> implements UserServer {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final JwtTokenUtil jwtTokenUtil;

    public UserServerImpl(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return baseMapper.selectList( null).stream().map(
                user -> new UserDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getNickname(),
                        user.getPassword(),
                        user.getTel(),
                        user.getEmail(),
                        user.getRole(),
                        user.getAvatar(),
                        user.isStatus()
                )
        ).collect(Collectors.toList());
    }

    @Override
    public IPage<UserDTO> listPageUser(int page, int limit) {
        return baseMapper.selectPage(
                new Page<>(page, limit),
                new QueryWrapper<>()
        ).convert(
                user -> new UserDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getNickname(),
                        user.getPassword(),
                        user.getTel(),
                        user.getEmail(),
                        user.getRole(),
                        user.getAvatar(),
                        user.isStatus()
                )
        ).setTotal(
                baseMapper.selectCount(null)
        );
    }

    @Override
    public User getUserById(Long id) {
        // 查询用户
        User user = baseMapper.selectOne(new QueryWrapper<User>().eq("user_id", id));

        // 判断用户是否存在
        if (user == null) { throw new RuntimeException("用户不存在"); }

        return user;
    }

    @Override
    public void saveUser(User user) {
        baseMapper.insert(user);
    }

    @Override
    public void registerUser(UserDTO userDTO) {
        // 1.验证必填字段
        if (!StringUtils.hasText(userDTO.getUsername())) {
            throw new RuntimeException("用户名不能为空");
        }
        if (!StringUtils.hasText(userDTO.getPassword())) {
            throw new RuntimeException("密码不能为空");
        }
        if (!StringUtils.hasText(userDTO.getTel())) {
            throw new RuntimeException("手机号不能为空");
        }

        // 2. 验证用户名格式
        if (!userDTO.getUsername().matches("^[a-zA-Z0-9_]{4,20}$")) {
            throw new RuntimeException("用户名格式不正确，应为4-20个字符的字母、数字或下划线");
        }

        // 3. 验证密码长度
        if (userDTO.getPassword().length() < 6) {
            throw new RuntimeException("密码长度不能少于6位");
        }

        // 4. 验证手机格式
        if (!userDTO.getTel().matches("^1[3-9]\\d{9}$")) {
            throw new RuntimeException("手机号格式不正确");
        }

        // 5. 检查用户名是否已存在
        if (existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }

        // 6. 检查手机是否已存在
        if (existsByTel(userDTO.getTel())) {
            throw new RuntimeException("手机号已被注册");
        }

        // 7. 创建用户实体
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setNickname(StringUtils.hasText(userDTO.getNickname()) ? userDTO.getNickname() : userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // 加密密码
        user.setTel(userDTO.getTel());
        String requestedRole = userDTO.getRole();
        String finalRole;

        if (!StringUtils.hasText(requestedRole)) {
            // 默认角色为 'customer'
            finalRole = UserRole.CUSTOMER.getRoleName();
        } else {
            // 验证请求的角色是否有效
            if (!UserRole.isValid(requestedRole)) {
                throw new RuntimeException("无效的角色，允许的角色为: 'merchant', 'customer'");
            }
            // 安全检查：禁止通过此公共接口注册 'admin'
            if (UserRole.ADMIN.getRoleName().equals(requestedRole)) {
                throw new RuntimeException("无法通过此接口注册管理员账户");
            }

            finalRole = requestedRole; // 'merchant' 或 'customer'
        }

        user.setRole(finalRole); // 设置经过验证的角色

        user.setAvatar(StringUtils.hasText(userDTO.getAvatar()) ? userDTO.getAvatar() :
                "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif");
        user.setStatus(true); // 默认激活状态

        // 8. 保存用户
        int result = baseMapper.insert(user);
        if (result != 1) {
            throw new RuntimeException("注册失败，请稍后重试");
            }
    }

    @Override
    public boolean existsByUsername(String username) {
        Long count = Long.valueOf(baseMapper.selectCount(
                new QueryWrapper<User>().eq("user_name", username)
        ));
        return count != null && count > 0;
    }

    @Override
    public User findByPhone(String tel) {
        return baseMapper.selectOne(new QueryWrapper<User>().eq("tel", tel));
    }

    @Override
    public boolean existsByTel(String tel) {
        Long count = baseMapper.selectCount(
                new QueryWrapper<User>().eq("tel", tel)
        ).longValue();
        return count != null && count > 0;
    }

    @Override
    public Map<String, Object> loginByTel(String tel, String password) {
        // 1. 根据手机号查询用户
        User user = baseMapper.selectOne(new QueryWrapper<User>().eq("tel", tel));

        // 2. 验证用户是否存在
        if (user == null) {
            throw new RuntimeException("手机号未注册");
        }

        // 3. 验证密码
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 4. 检查账户状态
        if (!user.isStatus()) {
            throw new RuntimeException("账户已被禁用");
        }

        // 5. 生成Token
        // 使用 User 的 Long ID 作为 JWT 的 "userId" 声明
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("loginType", "phone");
        String token = jwtTokenUtil.generateToken(user.getId(), claims);

        // 6. 准备返回的 DTO (隐藏密码)
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);

        // 7. 组装返回结果，类似微信登录
        return MapUtils.of(
                MapUtils.Pair.of("loginType", "pwd"),
                MapUtils.Pair.of("token", token),
                MapUtils.Pair.of("userInfo", userDTO),
                MapUtils.Pair.of("expiresIn", jwtTokenUtil.getExpiration())
        );
    }
}

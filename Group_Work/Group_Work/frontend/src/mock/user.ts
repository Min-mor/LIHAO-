import type { LoginDTO, LoginResult, RegisterDTO, UserDTO } from '@/api/types/user'

const mockUser: UserDTO = {
  id: 1,
  username: 'admin',
  nickname: 'Admin User',
  tel: '13800138000',
  avatar: 'https://example.com/avatar.png',
  role: 'admin',
}

export const userMock = {
  login: async (data: LoginDTO): Promise<LoginResult> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (data.tel === '13800138000' && data.password === '123456') {
      return {
        token: 'mock-token-123456',
        userInfo: mockUser,
        expiresIn: 3600,
      }
    }
    throw new Error('用户名或密码错误')
  },

  register: async (data: RegisterDTO): Promise<UserDTO> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      ...mockUser,
      username: data.username,
      nickname: data.nickname,
      tel: data.tel,
    }
  },

  getUserById: async (id: number): Promise<UserDTO> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { ...mockUser, id }
  },

  listPageUser: async (page: number, limit: number) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      list: [mockUser],
      total: 1,
      page,
      limit,
    }
  },
}

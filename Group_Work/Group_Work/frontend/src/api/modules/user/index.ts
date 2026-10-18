import type { LoginDTO, LoginResult, RegisterDTO, UserDTO } from './types'
import { shouldUseMock } from '@/api/config'
import { http } from '@/http/http'
import { userMock } from '@/mock/user'

export const userApi = {
  login: (data: LoginDTO) => {
    if (shouldUseMock('user'))
      return userMock.login(data)
    return http.post<LoginResult>('/api/user/login', data)
  },

  register: (data: RegisterDTO) => {
    if (shouldUseMock('user'))
      return userMock.register(data)
    return http.post<UserDTO>('/api/user/register', data)
  },

  getUserById: (id: number) => {
    if (shouldUseMock('user'))
      return userMock.getUserById(id)
    return http.get<UserDTO>(`/api/user/getById/${id}`)
  },

  listPageUser: (page: number, limit: number) => {
    if (shouldUseMock('user'))
      return userMock.listPageUser(page, limit)
    return http.get<{ list: UserDTO[], total: number }>(`/api/user/list/page/${page}`, { limit })
  },
}

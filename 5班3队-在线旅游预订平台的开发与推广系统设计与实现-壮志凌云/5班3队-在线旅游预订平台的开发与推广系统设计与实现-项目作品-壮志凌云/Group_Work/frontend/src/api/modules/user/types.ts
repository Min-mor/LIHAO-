export interface UserDTO {
  id?: number
  username: string
  password?: string
  nickname: string
  tel: string
  avatar?: string
  role?: string
  createTime?: string
  updateTime?: string
}

export interface LoginDTO {
  tel: string
  password?: string
  code?: string // For SMS login if needed in future
}

export interface RegisterDTO {
  username: string
  password: string
  confirmPassword: string
  nickname: string
  tel: string
  avatar?: string
  role?: string
}

export interface LoginResult {
  token: string
  userInfo: UserDTO
  expiresIn: number
}

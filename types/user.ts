import type { BaseServerResponse } from "./response"

export interface UserLogin {
  email: string
  password: string
}

export interface LoginResponse extends BaseServerResponse {
  id?: number
}

export interface Profile {
  id: number,
  username: string
  email?: string,
  firstName?: string
  lastName?: string,
}
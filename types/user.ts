import { BaseServerResponse } from "./response"

export interface UserLogin {
  email: string
  password: string
}

export interface LoginResponse extends BaseServerResponse {
  user?: number
}
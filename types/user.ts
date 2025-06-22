import type { BaseServerResponse, NewBaseServerResponse } from "./response"

export interface UserLogin {
  email: string
  password: string
}

export interface LoginResponse extends BaseServerResponse {
  id?: number
}

export interface ProfileResponse extends NewBaseServerResponse<Profile> { }

export interface Profile {
  id: number,
  username: string
  userOwnsProfile: boolean
  email?: string,
  firstName?: string
  lastName?: string,
}
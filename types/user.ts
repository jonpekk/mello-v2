import type { BaseServerResponse } from "./response"

export interface UserLogin {
  email: string
  password: string
}

export interface Profile {
  id: number,
  username: string
  userOwnsProfile: boolean
  email?: string,
  firstName?: string
  lastName?: string,
}

export type LoginResponse = BaseServerResponse<{ id: number }>

export type ProfileResponse = BaseServerResponse<Profile>
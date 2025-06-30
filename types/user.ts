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
  firstName?: string | null
  lastName?: string | null,
}

export type LoginResponse = BaseServerResponse<{ id?: number, message: string }>

export type CheckAuthResponse = BaseServerResponse<{ isLoggedIn: boolean, id?: number }>

export type ProfileResponse = BaseServerResponse<Profile>
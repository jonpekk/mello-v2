import type { BaseServerResponse } from "@/global/types/response"

export type RegisterInputs = {
  email: string,
  password: string
}

export type CreateUserResponse = BaseServerResponse<{
  userId?: string
}>

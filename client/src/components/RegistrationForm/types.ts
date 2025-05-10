import type { BaseServerResponse } from "@/global/types/response"

export type RegisterInputs = {
  email: string,
  password: string
}

export interface CreateUserResponse extends BaseServerResponse {
  userId?: string,
}

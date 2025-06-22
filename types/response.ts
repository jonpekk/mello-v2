export interface BaseServerResponse {
  message?: string,
  error?: unknown
}

export interface NewBaseServerResponse<T> {
  success: boolean,
  error?: unknown,
  data?: T
}
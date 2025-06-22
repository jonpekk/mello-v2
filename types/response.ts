export interface BaseServerResponse<T> {
  success: boolean,
  error?: unknown,
  data?: T
}
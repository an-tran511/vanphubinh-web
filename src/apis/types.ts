export type ListResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}

export type AuthResponse = {
  success: boolean
  user: {
    email: string
    name: string
  }
}

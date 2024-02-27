export type ListResponse<T> = {
  data: T[]
  meta: {
    total: number
    currentPage: number
    lastPage: number
  }
}

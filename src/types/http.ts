export type TListResponse<T> = {
  data: T[]
  meta: {
    total: number
    currentPage: number
    lastPage: number
  }
}

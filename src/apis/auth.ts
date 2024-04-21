import { fetchClient } from '@/utils/fetchClient'
import { type AuthResponse } from '@/apis/types'

export const login = async (data: { email: string; password: string }) => {
  const response = await fetchClient
    .url('/auth/login')
    .post(data)
    .json<AuthResponse>()
  return response
}

export const me = async () => {
  const response = await fetchClient.url('/auth/me').get().json<AuthResponse>()
  return response
}

export const logout = async () => {
  const response = await fetchClient.url('/auth/logout').post().json()
  return response
}

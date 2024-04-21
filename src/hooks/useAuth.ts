import { useContext } from 'react'
import { AuthContextInstance } from '@/authContext'

export function useAuth() {
  const context = useContext(AuthContextInstance)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

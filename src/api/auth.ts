import axiosInstance from '@/lib/axiosInstance'
import type { User } from '@/types'

interface AuthResponse {
  user: User
  token: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/register', { email, password, name })
  return data
}

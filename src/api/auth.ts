import axiosInstance from '@/lib/axiosInstance'
import type { User } from '@/types'

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/register', { email, password })
  return data
}

export async function refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const { data } = await axiosInstance.post('/auth/refresh', { refreshToken })
  return data
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout')
}

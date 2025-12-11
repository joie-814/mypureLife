//登入狀態管理
/*
記住誰登入了
記住登入憑證
提供登入/登出功能
可以檢查使用者是否已登入
*/

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 儲存使用者資料
  const user = ref(null)
  const token = ref(null)

  // 從 localStorage 載入登入狀態(即使重整頁面也會記得)
  const loadAuth = () => {
    const savedUser = localStorage.getItem('pureLifeUser')
    const savedToken = localStorage.getItem('pureLifeToken')
    
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
    }
  }

  // 儲存登入狀態到 localStorage
  const saveAuth = () => {
    if (user.value && token.value) {
      localStorage.setItem('pureLifeUser', JSON.stringify(user.value))
      localStorage.setItem('pureLifeToken', token.value)
    }
  }

  // 清除登入狀態
  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('pureLifeUser')
    localStorage.removeItem('pureLifeToken')
  }

  // 登入
  const login = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    saveAuth()
  }

  // 登出
  const logout = () => {
    clearAuth()
  }

  // 檢查是否已登入
  const isLoggedIn = computed(() => {
    return user.value !== null && token.value !== null
  })

  // 初始化時載入登入狀態
  loadAuth()

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    loadAuth
  }
})
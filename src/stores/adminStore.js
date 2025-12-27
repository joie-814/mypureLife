// src/stores/adminStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAdminStore = defineStore('admin', () => {
  const admin = ref(null)
  const token = ref(localStorage.getItem('adminToken') || '')

  const isLoggedIn = computed(() => !!token.value)

  // 登入
  const login = async (account, password) => {
    try {
      // 直接用 axios，不經過攔截器
      const response = await axios.post('http://localhost:8080/api/admin/login', {
        account,
        password
      })
      
      // 注意：直接用 axios 回傳的是 response.data
      const data = response.data
      
      if (data.success) {
        token.value = data.data.token
        admin.value = {
          adminId: data.data.adminId,
          account: data.data.account,
          name: data.data.name,
          role: data.data.role
        }
        
        localStorage.setItem('adminToken', token.value)
        localStorage.setItem('adminInfo', JSON.stringify(admin.value))
        
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('登入錯誤:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || '登入失敗' 
      }
    }
  }

  const logout = () => {
    token.value = ''
    admin.value = null
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
  }

  const initAdmin = () => {
    const savedAdmin = localStorage.getItem('adminInfo')
    if (savedAdmin && token.value) {
      admin.value = JSON.parse(savedAdmin)
    }
  }

  const getToken = () => token.value

  return {
    admin,
    token,
    isLoggedIn,
    login,
    logout,
    initAdmin,
    getToken
  }
})
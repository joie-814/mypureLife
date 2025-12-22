// 負責記憶和管理所有購物車資料 資料來源
// 未登入：localStorage / 已登入：後端 API

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/axios'
import { useAuthStore } from '@/stores/authStore'

export const useCartStore = defineStore('cart', () => {
  // 購物車商品清單
  const cartItems = ref([])

  // 載入狀態
  const isLoading = ref(false)
  
  // 錯誤訊息
  const error = ref(null)

  // localStorage key
  const LOCAL_STORAGE_KEY = 'pureLifeCart'

  /**
   * 檢查是否已登入
   */
  const isLoggedIn = () => {
    const authStore = useAuthStore()
    return authStore.isLoggedIn
  }

  // ========== localStorage 操作 ==========

  /**
   * 從 localStorage 載入購物車
   */
  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedCart) {
      try {
        cartItems.value = JSON.parse(savedCart)
      } catch (e) {
        cartItems.value = []
      }
    }
  }

  /**
   * 儲存到 localStorage
   */
  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems.value))
  }

  /**
   * 清空 localStorage 購物車
   */
  const clearLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }

  // ========== 主要方法 ==========
  /**
   * 載入購物車（根據登入狀態決定來源）
   */
  const loadCart = async () => {
    if (isLoggedIn()) {
      // 已登入：從後端載入
      await loadFromServer()
    } else {
      // 未登入：從 localStorage 載入
      loadFromLocalStorage()
    }
  }

  /**
   * 從後端載入購物車資料
   */
  const loadFromServer = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get('/cart')
      cartItems.value = response.data || []
    } catch (err) {
      console.error('載入購物車失敗:', err)
      error.value = '載入購物車失敗'
      cartItems.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加入商品到購物車
   */
  const addToCart = async (product, quantity = 1) => {
    if (isLoggedIn()) {
      // 已登入：呼叫後端 API
      return await addToCartServer(product, quantity)
    } else {
      // 未登入：存到 localStorage
      return addToCartLocal(product, quantity)
    }
  }

  /**
   * 加入購物車（localStorage 版本）
   */
  const addToCartLocal = (product, quantity = 1) => {
    const existingItem = cartItems.value.find(
      item => item.productId === product.productId
    )
    
    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.subtotal = existingItem.actualPrice * existingItem.quantity
    } else {
      // 建立符合後端格式的資料結構
      const actualPrice = product.promotionPrice || product.price
      cartItems.value.push({
        productId: product.productId,
        productName: product.productName,
        category: product.category,
        price: product.price,
        promotionPrice: product.promotionPrice,
        actualPrice: actualPrice,
        quantity: quantity, //使用輸入
        subtotal: actualPrice * quantity,
        stockQuantity: product.stockQuantity,
        imageUrl: product.imageUrl
      })
    }
    
    saveToLocalStorage()
    return { success: true, message: '已加入購物車' }
  }

  /**
   * 加入購物車（後端 API 版本）
   */
  const addToCartServer = async (product, quantity = 1) => {
    isLoading.value = true
    error.value = null
    
    try {
      await api.post('/cart', {
        productId: product.productId,
        quantity: quantity
      })
      
      await loadFromServer()
      return { success: true, message: '已加入購物車' }
    } catch (err) {
      console.error('加入購物車失敗:', err)
      const message = err.response?.data?.message || '加入購物車失敗'
      error.value = message
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新商品數量
   */
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(itemId)
    }

    if (isLoggedIn()) {
      return await updateQuantityServer(itemId, newQuantity)
    } else {
      return updateQuantityLocal(itemId, newQuantity)
    }
  }

  /**
   * 更新數量（localStorage 版本）
   */
  const updateQuantityLocal = (productId, newQuantity) => {
    const item = cartItems.value.find(item => item.productId === productId)
    
    if (item) {
      if (newQuantity > item.stockQuantity) {
        return { success: false, message: `庫存不足，目前庫存：${item.stockQuantity}` }
      }
      item.quantity = newQuantity
      item.subtotal = item.actualPrice * newQuantity
      saveToLocalStorage()
    }
    
    return { success: true }
  }

  /**
   * 更新數量（後端 API 版本）
   */
  const updateQuantityServer = async (cartId, newQuantity) => {
    error.value = null
    
    try {
      await api.put(`/cart/${cartId}?quantity=${newQuantity}`)
      
      const item = cartItems.value.find(item => item.cartId === cartId)
      if (item) {
        item.quantity = newQuantity
        item.subtotal = item.actualPrice * newQuantity
      }
      
      return { success: true }
    } catch (err) {
      console.error('更新數量失敗:', err)
      const message = err.response?.data?.message || '更新數量失敗'
      error.value = message
      await loadFromServer()
      return { success: false, message }
    }
  }

  /**
   * 刪除商品
   */
  const removeFromCart = async (itemId) => {
    if (isLoggedIn()) {
      return await removeFromCartServer(itemId)
    } else {
      return removeFromCartLocal(itemId)
    }
  }

  /**
   * 刪除商品（localStorage 版本）
   */
  const removeFromCartLocal = (productId) => {
    const index = cartItems.value.findIndex(item => item.productId === productId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      saveToLocalStorage()
    }
    return { success: true, message: '已從購物車移除' }
  }

  /**
   * 刪除商品（後端 API 版本）
   */
  const removeFromCartServer = async (cartId) => {
    error.value = null
    
    try {
      await api.delete(`/cart/${cartId}`)
      
      const index = cartItems.value.findIndex(item => item.cartId === cartId)
      if (index > -1) {
        cartItems.value.splice(index, 1)
      }
      
      return { success: true, message: '已從購物車移除' }
    } catch (err) {
      console.error('刪除商品失敗:', err)
      const message = err.response?.data?.message || '刪除商品失敗'
      error.value = message
      return { success: false, message }
    }
  }

  /**
   * 清空購物車
   */
  const clearCart = async () => {
    if (isLoggedIn()) {
      return await clearCartServer()
    } else {
      return clearCartLocal()
    }
  }

  /**
   * 清空購物車（localStorage 版本）
   */
  const clearCartLocal = () => {
    cartItems.value = []
    clearLocalStorage()
    return { success: true, message: '購物車已清空' }
  }

  /**
   * 清空購物車（後端 API 版本）
   */
  const clearCartServer = async () => {
    error.value = null
    
    try {
      await api.delete('/cart')
      cartItems.value = []
      return { success: true, message: '購物車已清空' }
    } catch (err) {
      console.error('清空購物車失敗:', err)
      const message = err.response?.data?.message || '清空購物車失敗'
      error.value = message
      return { success: false, message }
    }
  }

  /**
   * 登入後同步購物車（localStorage → 後端）
   */
  const syncCartAfterLogin = async () => {
    const localCart = localStorage.getItem(LOCAL_STORAGE_KEY)
    
    if (localCart) {
      try {
        const localItems = JSON.parse(localCart)
        
        // 將 localStorage 的商品逐一加入後端
        for (const item of localItems) {
          try {
            await api.post('/cart', {
              productId: item.productId,
              quantity: item.quantity
            })
          } catch (err) {
            console.warn(`同步商品 ${item.productName} 失敗:`, err)
          }
        }
        
        // 清空 localStorage
        clearLocalStorage()
      } catch (e) {
        console.error('同步購物車失敗:', e)
      }
    }
    
    // 重新載入後端購物車
    await loadFromServer()
  }

  /**
   * 登出時清理
   */
  const onLogout = () => {
    cartItems.value = []
    // 不清除 localStorage，讓訪客購物車保留
  }

  /**
   * 取得購物車項目的識別 key（用於 v-for）
   * 未登入用 productId，已登入用 cartId
   */
  const getItemKey = (item) => {
    return isLoggedIn() ? item.cartId : item.productId
  }

  /**
   * 取得用於更新/刪除的 ID
   * 未登入用 productId，已登入用 cartId
   */
  const getItemId = (item) => {
    return isLoggedIn() ? item.cartId : item.productId
  }

  // ========== Computed 會根據依賴的變數自動計算並緩存==========

  /**
   * 計算購物車商品總數量
   * reduce() 方法會遍歷陣列並累加每個商品的數量
   */
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  /**
   * 計算購物車總價
   */
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + Number(item.subtotal || 0)
    }, 0)
  })

  // 初始化：載入購物車
  loadCart()

  return {
    cartItems,
    isLoading,
    error,
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncCartAfterLogin,
    onLogout,
    getItemKey,
    getItemId,
    totalItems,
    totalPrice
  }
})
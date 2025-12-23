<template>
  <div class="checkout-container">
    <h1 class="page-title">結帳</h1>

    <!-- 載入中 -->
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>

    <!-- 購物車為空 -->
    <div v-else-if="cartStore.cartItems.length === 0" class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <p>購物車是空的</p>
      <router-link to="/" class="btn-continue">繼續購物</router-link>
    </div>

    <!-- 結帳表單 -->
    <div v-else class="checkout-content">
      <!-- 左側：收件資訊 -->
      <div class="checkout-form">
        <section class="form-section">
          <h2><i class="fas fa-truck"></i> 收件資訊</h2>
          
          <div class="form-group">
            <label for="recipientName">收件人姓名 <span class="required">*</span></label>
            <input 
              type="text" 
              id="recipientName"
              v-model="form.recipientName"
              placeholder="請輸入收件人姓名"
              :class="{ 'error': errors.recipientName }"
            >
            <p class="error-message" v-if="errors.recipientName">{{ errors.recipientName }}</p>
          </div>

          <div class="form-group">
            <label for="recipientPhone">收件人電話 <span class="required">*</span></label>
            <input 
              type="tel" 
              id="recipientPhone"
              v-model="form.recipientPhone"
              placeholder="請輸入手機號碼（09xxxxxxxx）"
              :class="{ 'error': errors.recipientPhone }"
            >
            <p class="error-message" v-if="errors.recipientPhone">{{ errors.recipientPhone }}</p>
          </div>

          <div class="form-group">
            <label for="recipientAddress">收件地址 <span class="required">*</span></label>
            <input 
              type="text" 
              id="recipientAddress"
              v-model="form.recipientAddress"
              placeholder="請輸入完整收件地址"
              :class="{ 'error': errors.recipientAddress }"
            >
            <p class="error-message" v-if="errors.recipientAddress">{{ errors.recipientAddress }}</p>
          </div>
        </section>

        <section class="form-section">
          <h2><i class="fas fa-credit-card"></i> 付款方式</h2>
          
          <div class="payment-options">
            <label class="payment-option" :class="{ 'selected': form.paymentMethod === 'credit_card' }">
              <input type="radio" v-model="form.paymentMethod" value="credit_card">
              <i class="fas fa-credit-card"></i>
              <span>信用卡付款</span>
            </label>
            
            <label class="payment-option" :class="{ 'selected': form.paymentMethod === 'atm' }">
              <input type="radio" v-model="form.paymentMethod" value="atm">
              <i class="fas fa-university"></i>
              <span>ATM 轉帳</span>
            </label>
            
            <label class="payment-option" :class="{ 'selected': form.paymentMethod === 'cvs' }">
              <input type="radio" v-model="form.paymentMethod" value="cvs">
              <i class="fas fa-store"></i>
              <span>超商代碼</span>
            </label>
          </div>
          <p class="error-message" v-if="errors.paymentMethod">{{ errors.paymentMethod }}</p>
        </section>
      </div>

      <!-- 右側：訂單摘要 -->
      <div class="order-summary">
        <h2>訂單摘要</h2>
        
        <div class="summary-items">
          <div class="summary-item" v-for="item in cartStore.cartItems" :key="item.productId">
            <div class="item-info">
              <span class="item-name">{{ item.productName }}</span>
              <span class="item-qty">x {{ item.quantity }}</span>
            </div>
            <span class="item-price">NT$ {{ Number(item.subtotal).toLocaleString() }}</span>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-row">
          <span>商品小計</span>
          <span>NT$ {{ formattedTotalPrice }}</span>
        </div>
        
        <div class="summary-row">
          <span>運費</span>
          <span>{{ shippingFee === 0 ? '免運費' : `NT$ ${shippingFee}` }}</span>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-row total">
          <span>總計</span>
          <span>NT$ {{ formattedGrandTotal }}</span>
        </div>

        <button 
          class="btn-submit" 
          @click="submitOrder"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">
            <i class="fas fa-spinner fa-spin"></i> 處理中...
          </span>
          <span v-else>確認下單</span>
        </button>

        <router-link to="/cart" class="btn-back">
          <i class="fas fa-arrow-left"></i> 返回購物車
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import api from '@/utils/axios'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// 載入狀態
const isLoading = ref(true)
const isSubmitting = ref(false)

// 表單資料
const form = ref({
  recipientName: '',
  recipientPhone: '',
  recipientAddress: '',
  paymentMethod: 'credit_card'
})

// 錯誤訊息
const errors = ref({})

// 頁面載入
onMounted(async () => {
  // 檢查是否登入
  if (!authStore.isLoggedIn) {
    router.push({
      path: '/login',
      query: { redirect: '/checkout' }
    })
    return
  }

  // 載入購物車
  await cartStore.loadCart()
  
  // 預填會員資料
  if (authStore.user) {
    form.value.recipientName = authStore.user.name || ''
  }

  isLoading.value = false
})

// 運費計算
const shippingFee = computed(() => {
  return cartStore.totalPrice >= 1200 ? 0 : 60
})

// 格式化金額
const formattedTotalPrice = computed(() => {
  return Number(cartStore.totalPrice).toLocaleString()
})

const formattedGrandTotal = computed(() => {
  return Number(cartStore.totalPrice + shippingFee.value).toLocaleString()
})

// 驗證表單
const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.recipientName.trim()) {
    errors.value.recipientName = '請輸入收件人姓名'
    isValid = false
  }

  if (!form.value.recipientPhone.trim()) {
    errors.value.recipientPhone = '請輸入收件人電話'
    isValid = false
  } else if (!/^09\d{8}$/.test(form.value.recipientPhone)) {
    errors.value.recipientPhone = '請輸入正確的手機號碼格式（09xxxxxxxx）'
    isValid = false
  }

  if (!form.value.recipientAddress.trim()) {
    errors.value.recipientAddress = '請輸入收件地址'
    isValid = false
  }

  if (!form.value.paymentMethod) {
    errors.value.paymentMethod = '請選擇付款方式'
    isValid = false
  }

  return isValid
}

// 提交訂單
const submitOrder = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await api.post('/orders', {
      recipientName: form.value.recipientName,
      recipientPhone: form.value.recipientPhone,
      recipientAddress: form.value.recipientAddress,
      paymentMethod: form.value.paymentMethod
    })

    // 訂單建立成功，跳轉到完成頁
    router.push({
      path: '/order-complete',
      query: { orderNumber: response.data.orderNumber }
    })
  } catch (err) {
    console.error('建立訂單失敗:', err)
    alert(err.response?.data?.message || '建立訂單失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

/* 載入中 & 空購物車 */
.loading,
.empty-cart {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.loading i,
.empty-cart i {
  font-size: 60px;
  margin-bottom: 20px;
}

.btn-continue {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 30px;
  background-color: #3A6B5C;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.btn-continue:hover {
  background-color: #2d5447;
}

/* 結帳內容 */
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
}

/* 表單區塊 */
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-section h2 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-section h2 i {
  color: #3A6B5C;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #34495e;
}

.required {
  color: #e74c3c;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3A6B5C;
}

.form-group input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

/* 付款方式 */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover {
  border-color: #3A6B5C;
}

.payment-option.selected {
  border-color: #3A6B5C;
  background-color: #f0f7f4;
}

.payment-option input {
  display: none;
}

.payment-option i {
  font-size: 20px;
  color: #3A6B5C;
  width: 24px;
}

.payment-option span {
  font-size: 16px;
  color: #2c3e50;
}

/* 訂單摘要 */
.order-summary {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.order-summary h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.summary-items {
  max-height: 300px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 14px;
  color: #2c3e50;
}

.item-qty {
  font-size: 13px;
  color: #7f8c8d;
}

.item-price {
  font-weight: 600;
  color: #2c3e50;
}

.summary-divider {
  border-top: 1px solid #e0e0e0;
  margin: 15px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  color: #34495e;
}

.summary-row.total {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 10px;
}

.btn-submit {
  width: 100%;
  padding: 16px;
  background-color: #3A6B5C;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2d5447;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-back {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #7f8c8d;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.btn-back:hover {
  color: #3A6B5C;
}

/* 響應式 */
@media (max-width: 900px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}
</style>
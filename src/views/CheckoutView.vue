<template>
  <div class="checkout-container">
    <h1>結帳頁面</h1>
    <p>歡迎，{{ authStore.user?.name }}！</p>
    <p>這裡是結帳頁面（開發中...）</p>
    
    <div class="info-box">
      <h2>訂單資訊</h2>
      <p>此頁面需要登入才能訪問</p>
      <button @click="$router.push('/cart')" class="btn-back">
        返回購物車
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore.js'

const authStore = useAuthStore()
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  color: #3A6B5C;
  margin-bottom: 20px;
}

.info-box {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.info-box h2 {
  font-size: 21px;
  color: #333;
  margin-bottom: 15px;
}

.btn-back {
  margin-top: 20px;
  padding: 12px 24px;
  background: #3A6B5C;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #2a6626;
}
</style>
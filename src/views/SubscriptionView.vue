<template>
  <div class="subscription-container">
    <h1>我的定期購</h1>
    
    <div class="empty-state">
      <i class="fas fa-calendar-check"></i>
      <p>目前沒有定期購訂閱</p>
      <p class="subtitle">訂閱定期購，健康保養不間斷</p>
      <button @click="$router.push('/')" class="btn-subscribe">
        探索定期購商品
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore.js'

const authStore = useAuthStore()
</script>

<style scoped>
.subscription-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  color: #3A6B5C;
  margin-bottom: 30px;
}

.empty-state {
  background: white;
  padding: 80px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.empty-state i {
  font-size: 80px;
  color: #bdc3c7;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #95a5a6;
  margin-bottom: 30px;
}

.btn-subscribe {
  padding: 12px 30px;
  background: #3A6B5C;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-subscribe:hover {
  background: #2a6626;
}
</style>
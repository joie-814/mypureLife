<template>
  <div class="member-container">
    <h1>會員中心</h1>
    
    <div class="member-info">
      <h2>會員資料</h2>
      <div class="info-row">
        <span class="label">姓名：</span>
        <span class="value">{{ authStore.user?.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">電子郵件：</span>
        <span class="value">{{ authStore.user?.email }}</span>
      </div>
      <div class="info-row">
        <span class="label">手機號碼：</span>
        <span class="value">{{ authStore.user?.phone }}</span>
      </div>
      <div class="info-row">
        <span class="label">會員等級：</span>
        <span class="value">{{ authStore.user?.member_level }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore.js'

const authStore = useAuthStore()
</script>

<style scoped>
.member-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  color: #3A6B5C;
  margin-bottom: 50px;
}

.member-info {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.member-info h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.info-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: #3A6B5C;
  font-weight: 600;
  width: 120px;
  flex-shrink: 0;
}

.value {
  color: #555;
  flex: 1;
}
</style>
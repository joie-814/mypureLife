<template>
  <div class="subscriptions-page">
    <header class="page-header">
      <h1>訂閱管理</h1>
    </header>

    <div class="content-card">
      <div v-if="isLoading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>載入中...</p>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>訂閱ID</th>
              <th>商品名稱</th>
              <th>收件人</th>
              <th>配送週期</th>
              <th>數量</th>
              <th>狀態</th>
              <th>下次配送</th>
              <th>開始日期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sub in subscriptions" :key="sub.subscriptionId">
              <td>{{ sub.subscriptionId }}</td>
              <td>{{ sub.productName }}</td>
              <td>{{ sub.recipientName }}</td>
              <td>{{ getCycleText(sub.cycleType) }}</td>
              <td>{{ sub.quantity }}</td>
              <td>
                <span class="status-badge" :class="sub.subscriptionStatus">
                  {{ getStatusText(sub.subscriptionStatus) }}
                </span>
              </td>
              <td>{{ sub.nextDeliveryDate || '-' }}</td>
              <td>{{ sub.startDate }}</td>
            </tr>
          </tbody>
        </table>

        <p v-if="subscriptions.length === 0" class="no-data">目前沒有訂閱</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '@/utils/adminAxios'

const subscriptions = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await adminApi.get('/admin/subscriptions')
    if (response.success) {
      subscriptions.value = response.data
    }
  } catch (error) {
    console.error('載入訂閱失敗:', error)
  } finally {
    isLoading.value = false
  }
})

const getCycleText = (cycleType) => {
  const map = { 'monthly': '每月', 'quarterly': '每三個月', 'biannual': '每六個月' }
  return map[cycleType] || cycleType
}

const getStatusText = (status) => {
  const map = { 'active': '進行中', 'paused': '已暫停', 'cancelled': '已取消' }
  return map[status] || status
}
</script>

<style scoped>
.subscriptions-page {
  padding: 30px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 26px;
  color: #2c3e50;
}

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #7f8c8d;
}

.loading i {
  font-size: 40px;
  margin-bottom: 15px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 15px 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #34495e;
  font-size: 13px;
}

.data-table td {
  font-size: 14px;
  color: #2c3e50;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.active { background: #d4edda; color: #155724; }
.status-badge.paused { background: #fff3cd; color: #856404; }
.status-badge.cancelled { background: #f8d7da; color: #721c24; }

.no-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .subscriptions-page { padding: 20px; }
}
</style>
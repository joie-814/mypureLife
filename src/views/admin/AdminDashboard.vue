<template>
  <div class="dashboard-page">
    <header class="page-header">
      <h1>首頁總覽</h1>
      <p class="current-time">{{ currentTime }}</p>
    </header>

    <!-- 統計卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon orders">
          <i class="fas fa-receipt"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.totalOrders }}</h3>
          <p>總訂單數</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pending">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.pendingOrders }}</h3>
          <p>待處理訂單</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon members">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.totalMembers }}</h3>
          <p>會員人數</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon subscriptions">
          <i class="fas fa-sync-alt"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.activeSubscriptions }}</h3>
          <p>進行中訂閱</p>
        </div>
      </div>
    </div>

    <!-- 回前台按鈕 -->
    <div class="action-section">
      <a href="/" target="_blank" class="btn-go-frontend">
        <i class="fas fa-external-link-alt"></i>
        前往前台網站
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import adminApi from '@/utils/adminAxios'

const currentTime = ref('')
const stats = ref({
  totalOrders: 0,
  pendingOrders: 0,
  totalMembers: 0,
  activeSubscriptions: 0
})

let timeInterval

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const loadStats = async () => {
  try {
    // 取得訂單統計
    const ordersRes = await adminApi.get('/admin/orders')
    if (ordersRes.success) {
      stats.value.totalOrders = ordersRes.data.length
      stats.value.pendingOrders = ordersRes.data.filter(o => o.orderStatus === 'pending').length
    }

    // 取得會員統計
    const membersRes = await adminApi.get('/admin/members')
    if (membersRes.success) {
      stats.value.totalMembers = membersRes.data.length
    }

    // 取得訂閱統計
    const subsRes = await adminApi.get('/admin/subscriptions')
    if (subsRes.success) {
      stats.value.activeSubscriptions = subsRes.data.filter(s => s.subscriptionStatus === 'active').length
    }
  } catch (error) {
    console.error('載入統計失敗:', error)
  }
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  loadStats()
})

onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<style scoped>
.dashboard-page {
  padding: 30px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 26px;
  color: #2c3e50;
  margin: 0;
}

.current-time {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

/* 統計卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.orders {
  background: #e8f5e9;
  color: #2e7d32;
}

.stat-icon.pending {
  background: #fff3e0;
  color: #e65100;
}

.stat-icon.members {
  background: #e3f2fd;
  color: #1565c0;
}

.stat-icon.subscriptions {
  background: #f3e5f5;
  color: #7b1fa2;
}

.stat-info h3 {
  font-size: 28px;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.stat-info p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

/* 回前台按鈕 */
.action-section {
  display: flex;
  justify-content: center;
}

.btn-go-frontend {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: #3A6B5C;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-go-frontend:hover {
  background: #2d5447;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(58, 107, 92, 0.3);
}

.btn-go-frontend i {
  font-size: 18px;
}

/* 響應式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
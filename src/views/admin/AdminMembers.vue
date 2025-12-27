<template>
  <div class="members-page">
    <header class="page-header">
      <h1>會員管理</h1>
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
              <th>會員ID</th>
              <th>帳號</th>
              <th>姓名</th>
              <th>Email</th>
              <th>電話</th>
              <th>會員等級</th>
              <th>註冊時間</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.memberId">
              <td>{{ member.memberId }}</td>
              <td>{{ member.account }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.email }}</td>
              <td>{{ member.phone || '-' }}</td>
              <td>
                <span class="level-badge" :class="member.memberLevel">
                  {{ getLevelText(member.memberLevel) }}
                </span>
              </td>
              <td>{{ formatDate(member.registrationTime) }}</td>
            </tr>
          </tbody>
        </table>

        <p v-if="members.length === 0" class="no-data">目前沒有會員</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '@/utils/adminAxios'

const members = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await adminApi.get('/admin/members')
    if (response.success) {
      members.value = response.data
    }
  } catch (error) {
    console.error('載入會員失敗:', error)
  } finally {
    isLoading.value = false
  }
})

const getLevelText = (level) => {
  const map = { 'general': '一般會員', 'vip': 'VIP', 'premium': '尊榮會員' }
  return map[level] || level
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-TW')
}
</script>

<style scoped>
.members-page {
  padding: 30px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 26px;
  color: #2c3e50;
  margin: 0;
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
  display: block;
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

.level-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.level-badge.general {
  background: #e0e0e0;
  color: #616161;
}

.level-badge.vip {
  background: #fff3e0;
  color: #e65100;
}

.level-badge.premium {
  background: #f3e5f5;
  color: #7b1fa2;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .members-page {
    padding: 20px;
  }
}
</style>
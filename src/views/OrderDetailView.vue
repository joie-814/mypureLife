<template>
  <div class="detail-container">
    <!-- 載入中 -->
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>

    <!-- 訂單內容 -->
    <div v-else-if="order" class="order-detail">
      <!-- 返回按鈕 -->
      <router-link to="/orders" class="btn-back">
        <i class="fas fa-arrow-left"></i> 返回訂單列表
      </router-link>

      <!-- 訂單標頭 -->
      <div class="detail-header">
        <div class="header-left">
          <h1>訂單詳情</h1>
          <p class="order-number">{{ order.orderNumber }}</p>
        </div>
        <div class="header-right">
          <span class="order-status" :class="getStatusClass(order.orderStatus)">
            {{ getStatusText(order.orderStatus) }}
          </span>
        </div>
      </div>

      <!-- 訂單資訊卡片 -->
      <div class="detail-grid">
        <!-- 收件資訊 -->
        <div class="info-card">
          <h3><i class="fas fa-truck"></i> 收件資訊</h3>
          <div class="info-row">
            <span class="label">收件人</span>
            <span class="value">{{ order.recipientName }}</span>
          </div>
          <div class="info-row">
            <span class="label">電話</span>
            <span class="value">{{ order.recipientPhone }}</span>
          </div>
          <div class="info-row">
            <span class="label">地址</span>
            <span class="value">{{ order.recipientAddress }}</span>
          </div>
        </div>

        <!-- 付款資訊 -->
        <div class="info-card">
          <h3><i class="fas fa-credit-card"></i> 付款資訊</h3>
          <div class="info-row">
            <span class="label">付款方式</span>
            <span class="value">{{ getPaymentMethodText(order.paymentMethod) }}</span>
          </div>
          <div class="info-row">
            <span class="label">付款狀態</span>
            <span class="value" :class="getPaymentStatusClass(order.paymentStatus)">
              {{ getPaymentStatusText(order.paymentStatus) }}
            </span>
          </div>
          <div class="info-row">
            <span class="label">訂單時間</span>
            <span class="value">{{ formatDate(order.orderTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 商品明細 -->
      <div class="items-card">
        <h3><i class="fas fa-box"></i> 商品明細</h3>
        <div class="items-list">
          <div class="item-row header">
            <span class="col-product">商品</span>
            <span class="col-price">單價</span>
            <span class="col-qty">數量</span>
            <span class="col-subtotal">小計</span>
          </div>
          <div class="item-row" v-for="item in order.items" :key="item.productId">
            <span class="col-product">{{ item.productName }}</span>
            <span class="col-price">NT$ {{ Number(item.unitPrice).toLocaleString() }}</span>
            <span class="col-qty">{{ item.quantity }}</span>
            <span class="col-subtotal">NT$ {{ Number(item.subtotal).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- 金額摘要 -->
      <div class="summary-card">
        <div class="summary-row">
          <span>商品小計</span>
          <span>NT$ {{ Number(order.totalAmount).toLocaleString() }}</span>
        </div>
        <div class="summary-row">
          <span>運費</span>
          <span>{{ Number(order.shippingFee) === 0 ? '免運費' : `NT$ ${Number(order.shippingFee).toLocaleString()}` }}</span>
        </div>
        <div class="summary-row total">
          <span>總計</span>
          <span>NT$ {{ Number(order.grandTotal).toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- 找不到訂單 -->
    <div v-else class="not-found">
      <i class="fas fa-exclamation-circle"></i>
      <p>找不到此訂單</p>
      <router-link to="/orders" class="btn-back-link">返回訂單列表</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/axios'

const route = useRoute()
const order = ref(null)
const isLoading = ref(true)

// 載入訂單詳情
onMounted(async () => {
  const orderId = route.params.id
  
  try {
    const response = await api.get(`/orders/${orderId}`)
    order.value = response.data
  } catch (err) {
    console.error('載入訂單詳情失敗:', err)
  } finally {
    isLoading.value = false
  }
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 訂單狀態
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待處理',
    'confirmed': '已確認',
    'shipping': '配送中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    'pending': 'status-pending',
    'confirmed': 'status-confirmed',
    'shipping': 'status-shipping',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return classMap[status] || ''
}

// 付款狀態
const getPaymentStatusText = (status) => {
  const statusMap = {
    'unpaid': '未付款',
    'paid': '已付款',
    'refunded': '已退款'
  }
  return statusMap[status] || status
}

const getPaymentStatusClass = (status) => {
  const classMap = {
    'unpaid': 'text-unpaid',
    'paid': 'text-paid',
    'refunded': 'text-refunded'
  }
  return classMap[status] || ''
}

// 付款方式
const getPaymentMethodText = (method) => {
  const methodMap = {
    'credit_card': '信用卡',
    'atm': 'ATM 轉帳',
    'cvs': '超商代碼'
  }
  return methodMap[method] || method
}
</script>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 載入中 */
.loading {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.loading i {
  font-size: 48px;
  margin-bottom: 20px;
}

/* 返回按鈕 */
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7f8c8d;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 20px;
  transition: color 0.3s;
}

.btn-back:hover {
  color: #3A6B5C;
}

/* 訂單標頭 */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.header-left h1 {
  font-size: 28px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.order-number {
  font-size: 14px;
  color: #7f8c8d;
}

.order-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-confirmed {
  background-color: #cce5ff;
  color: #004085;
}

.status-shipping {
  background-color: #d4edda;
  color: #155724;
}

.status-completed {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

/* 資訊卡片 Grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.info-card,
.items-card,
.summary-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.info-card h3,
.items-card h3 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-card h3 i,
.items-card h3 i {
  color: #3A6B5C;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: #7f8c8d;
  font-size: 14px;
}

.info-row .value {
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  max-width: 60%;
}

.text-unpaid {
  color: #e74c3c;
}

.text-paid {
  color: #2e7d32;
}

.text-refunded {
  color: #e65100;
}

/* 商品明細 */
.items-card {
  margin-bottom: 20px;
}

.items-list {
  margin-top: 15px;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 0.5fr 1fr;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
  color: #34495e;
}

.item-row.header {
  font-weight: 600;
  color: #7f8c8d;
  font-size: 13px;
  border-bottom: 2px solid #e0e0e0;
}

.item-row:last-child {
  border-bottom: none;
}

.col-price,
.col-qty,
.col-subtotal {
  text-align: right;
}

/* 金額摘要 */
.summary-card {
  margin-top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 15px;
  color: #34495e;
  border-bottom: 1px solid #f5f5f5;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  font-size: 20px;
  font-weight: bold;
  color: #3A6B5C;
  padding-top: 15px;
  margin-top: 10px;
  border-top: 2px solid #e0e0e0;
}

/* 找不到訂單 */
.not-found {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.not-found i {
  font-size: 60px;
  margin-bottom: 20px;
}

.btn-back-link {
  display: inline-block;
  margin-top: 20px;
  color: #3A6B5C;
  text-decoration: none;
}

.btn-back-link:hover {
  text-decoration: underline;
}

/* 響應式 */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
    gap: 15px;
  }

  .item-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .item-row.header {
    display: none;
  }

  .col-product {
    grid-column: 1 / -1;
    font-weight: 500;
  }
}
</style>
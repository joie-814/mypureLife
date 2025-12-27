<template>
  <div class="orders-page">
    <header class="page-header">
      <h1>訂單管理</h1>
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
              <th>訂單編號</th>
              <th>收件人</th>
              <th>金額</th>
              <th>付款方式</th>
              <th>訂單狀態</th>
              <th>付款狀態</th>
              <th>訂單時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.orderId">
              <td class="order-number">{{ order.orderNumber }}</td>
              <td>{{ order.recipientName }}</td>
              <td class="amount">NT$ {{ Number(order.grandTotal).toLocaleString() }}</td>
              <td>{{ getPaymentMethodText(order.paymentMethod) }}</td>
              <td>
                <select 
                  class="status-select" 
                  :class="getStatusClass(order.orderStatus)"
                  v-model="order.orderStatus"
                  @change="updateOrderStatus(order)"
                >
                  <option value="pending">待處理</option>
                  <option value="confirmed">已確認</option>
                  <option value="shipping">配送中</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </td>
              <td>
                <select 
                  class="status-select" 
                  :class="getPaymentStatusClass(order.paymentStatus)"
                  v-model="order.paymentStatus"
                  @change="updatePaymentStatus(order)"
                >
                  <option value="unpaid">未付款</option>
                  <option value="paid">已付款</option>
                  <option value="refunded">已退款</option>
                </select>
              </td>
              <td>{{ formatDate(order.orderTime) }}</td>
              <td>
                <button class="btn-detail" @click="showOrderDetail(order)">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="orders.length === 0" class="no-data">目前沒有訂單</p>
      </div>
    </div>

    <!-- 訂單詳情 Modal -->
    <div class="modal-overlay" v-if="selectedOrder" @click="selectedOrder = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>訂單詳情</h2>
          <button class="btn-close" @click="selectedOrder = null">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h3>訂單資訊</h3>
            <div class="detail-row">
              <span class="label">訂單編號</span>
              <span class="value">{{ selectedOrder.orderNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="label">訂單時間</span>
              <span class="value">{{ formatDate(selectedOrder.orderTime) }}</span>
            </div>
          </div>
          <div class="detail-section">
            <h3>收件資訊</h3>
            <div class="detail-row">
              <span class="label">收件人</span>
              <span class="value">{{ selectedOrder.recipientName }}</span>
            </div>
            <div class="detail-row">
              <span class="label">電話</span>
              <span class="value">{{ selectedOrder.recipientPhone }}</span>
            </div>
            <div class="detail-row">
              <span class="label">地址</span>
              <span class="value">{{ selectedOrder.recipientAddress }}</span>
            </div>
          </div>
          <div class="detail-section">
            <h3>金額</h3>
            <div class="detail-row">
              <span class="label">商品小計</span>
              <span class="value">NT$ {{ Number(selectedOrder.totalAmount).toLocaleString() }}</span>
            </div>
            <div class="detail-row">
              <span class="label">運費</span>
              <span class="value">NT$ {{ Number(selectedOrder.shippingFee).toLocaleString() }}</span>
            </div>
            <div class="detail-row total">
              <span class="label">總計</span>
              <span class="value">NT$ {{ Number(selectedOrder.grandTotal).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '@/utils/adminAxios'

const orders = ref([])
const isLoading = ref(true)
const selectedOrder = ref(null)

onMounted(async () => {
  await loadOrders()
})

const loadOrders = async () => {
  isLoading.value = true
  try {
    const response = await adminApi.get('/admin/orders')
    if (response.success) {
      orders.value = response.data
    }
  } catch (error) {
    console.error('載入訂單失敗:', error)
  } finally {
    isLoading.value = false
  }
}

const updateOrderStatus = async (order) => {
  try {
    await adminApi.put(`/admin/orders/${order.orderId}/status?status=${order.orderStatus}`)
    alert('訂單狀態已更新')
  } catch (error) {
    alert('更新失敗')
    loadOrders()
  }
}

const updatePaymentStatus = async (order) => {
  try {
    await adminApi.put(`/admin/orders/${order.orderId}/payment?status=${order.paymentStatus}`)
    alert('付款狀態已更新')
  } catch (error) {
    alert('更新失敗')
    loadOrders()
  }
}

const showOrderDetail = (order) => {
  selectedOrder.value = order
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-TW')
}

const getPaymentMethodText = (method) => {
  const map = { 'credit_card': '信用卡', 'atm': 'ATM', 'cvs': '超商' }
  return map[method] || method
}

const getStatusClass = (status) => {
  const map = {
    'pending': 'status-pending',
    'confirmed': 'status-confirmed',
    'shipping': 'status-shipping',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return map[status] || ''
}

const getPaymentStatusClass = (status) => {
  const map = {
    'unpaid': 'payment-unpaid',
    'paid': 'payment-paid',
    'refunded': 'payment-refunded'
  }
  return map[status] || ''
}
</script>

<style scoped>
.orders-page {
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

.order-number {
  font-family: monospace;
  font-weight: 600;
}

.amount {
  font-weight: 600;
  color: #3A6B5C;
}

.status-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-confirmed { background: #cce5ff; color: #004085; }
.status-shipping { background: #d4edda; color: #155724; }
.status-completed { background: #d1e7dd; color: #0f5132; }
.status-cancelled { background: #f8d7da; color: #721c24; }

.payment-unpaid { background: #fee; color: #e74c3c; }
.payment-paid { background: #e8f5e9; color: #2e7d32; }
.payment-refunded { background: #fff3e0; color: #e65100; }

.btn-detail {
  padding: 8px 12px;
  background: #f0f7f4;
  color: #3A6B5C;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-detail:hover {
  background: #3A6B5C;
  color: white;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  font-size: 18px;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #7f8c8d;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h3 {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.detail-row .label { color: #7f8c8d; }
.detail-row .value { color: #2c3e50; font-weight: 500; }

.detail-row.total {
  font-size: 18px;
  font-weight: bold;
  color: #3A6B5C;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 2px solid #e0e0e0;
}

@media (max-width: 768px) {
  .orders-page { padding: 20px; }
}
</style>
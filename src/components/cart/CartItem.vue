<!-- 顯示單一商品，並提供修改數量、刪除的按鈕 -->

<template>
  <div class="cart-item">
    <div class="item-image">
        <img 
          :src="getProductImageUrl(props.item.imageUrl || '/images/products/default.jpeg')" 
          :alt="props.item.productName"
        />
    </div>

    <div class="item-info">
      <h3 class="item-name">{{ item.productName }}</h3>
      <p class="item-category">{{ item.category }}</p>
      <div class="item-price">
        <!-- 有促銷價時顯示原價刪除線 -->
        <span v-if="item.promotionPrice" class="original-price">
          NT$ {{ Number(item.price).toLocaleString() }}
        </span>
        <span class="actual-price">
          NT$ {{ Number(item.actualPrice).toLocaleString() }}
        </span>
      </div>
      <p class="item-stock" v-if="item.stockQuantity != null && item.stockQuantity <= 10">
        <i class="fas fa-exclamation-circle"></i>
        剩餘 {{ item.stockQuantity }} 件
      </p>
    </div>

    <div class="item-quantity">
      <button 
        class="qty-btn" 
        @click="decreaseQuantity"
        :disabled="item.quantity <= 1|| isUpdating"
      >
        <i class="fas fa-minus"></i>
      </button>
      <input 
        type="number" 
        class="qty-input" 
        :value="item.quantity"
        @change="handleQuantityChange"
        min="1"
        :max="item.stockQuantity"
        :disabled="isUpdating"
      >
      <button 
        class="qty-btn" 
        @click="increaseQuantity"
        :disabled="item.quantity >= item.stockQuantity || isUpdating"
      >
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <div class="item-subtotal">
      <p class="subtotal-label">小計</p>
      <p class="subtotal-price">NT$ {{ Number(item.subtotal).toLocaleString() }}</p>
    </div>

    <button class="btn-remove" @click="removeItem" :disabled="isUpdating">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-quantity', 'remove'])

// 更新中狀態（防止連點）
const isUpdating = ref(false)

// 商品圖片
const getProductImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  if (imageUrl.startsWith('/images')) return "http://localhost:8080" + imageUrl
  if (imageUrl.startsWith('/')) return "http://localhost:8080" + imageUrl
  return "http://localhost:8080/uploads/products/" + imageUrl
}

// 減少數量
const decreaseQuantity = () => {
  if (props.item.quantity > 1 && !isUpdating.value) {
    isUpdating.value = true
    emit('update-quantity', props.item.quantity - 1)
    setTimeout(() => { isUpdating.value = false }, 300)
  }
}

// 增加數量
const increaseQuantity = () => {
  if (props.item.quantity < props.item.stockQuantity && !isUpdating.value) {
    isUpdating.value = true
    emit('update-quantity', props.item.quantity + 1)
    setTimeout(() => { isUpdating.value = false }, 300) //使用者點擊增加數量後，按鈕會禁用 300ms
  }
}

// 處理手動輸入數量
const handleQuantityChange = (event) => {
  let newQuantity = parseInt(event.target.value)
  
  if (isNaN(newQuantity) || newQuantity < 1) {
    newQuantity = 1
  } else if (newQuantity > props.item.stockQuantity) {
    newQuantity = props.item.stockQuantity
    alert(`此商品庫存僅剩 ${props.item.stockQuantity} 件`)
  }
  
  emit('update-quantity', newQuantity)
}

// 刪除商品
const removeItem = () => {
  emit('remove')
}
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr 150px 120px 50px;
  gap: 20px;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 商品圖片 */
.item-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品資訊 */
.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.item-category {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.item-price {
  font-size: 20px;
  color: #3A6B5C;
  font-weight: bold;
  margin: 0;
}

.original-price {
  font-size: 14px;
  color: #95a5a6;
  text-decoration: line-through;
}

.actual-price {
  font-size: 20px;
  color: #3A6B5C;
  font-weight: bold;
}

.item-stock {
  font-size: 14px;
  color: #e74c3c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 數量控制 */
.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}

.qty-btn:hover:not(:disabled) {
  background-color: #3A6B5C;
  color: white;
  border-color: #3A6B5C;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  height: 36px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
}

.qty-input:focus {
  outline: none;
  border-color: #3A6B5C;
}

.qty-input:disabled {
  background-color: #f5f5f5;
}

/* 隱藏數字輸入框的上下箭頭 */
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input[type=number] {
  -moz-appearance: textfield;
}

/* 小計 */
.item-subtotal {
  text-align: right;
}

.subtotal-label {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 5px 0;
}

.subtotal-price {
  font-size: 22px;
  color: #2c3e50;
  font-weight: bold;
  margin: 0;
}

/* 刪除按鈕 */
.btn-remove {
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  color: #95a5a6;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.btn-remove:hover:not(:disabled) {
  background-color: #fee;
  color: #e74c3c;
}

.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 15px;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .item-info {
    grid-column: 2;
  }

  .item-name {
    font-size: 16px;
  }

  .item-price {
    font-size: 18px;
  }

  .item-quantity {
    grid-column: 1 / -1;
    justify-content: flex-start;
    padding-left: 10px;
  }

  .item-subtotal {
    grid-column: 1 / -1;
    text-align: left;
    padding-left: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .subtotal-label {
    margin: 0;
  }

  .btn-remove {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>
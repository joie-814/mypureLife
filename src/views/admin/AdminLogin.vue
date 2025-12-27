<template>
  <div class="admin-login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>pureLife 管理後台</h1>
        <p>請輸入管理員帳號密碼</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="account">帳號</label>
          <div class="input-wrapper">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              id="account"
              v-model="form.account"
              placeholder="請輸入帳號"
              :disabled="isLoading"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="password">密碼</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password"
              v-model="form.password"
              placeholder="請輸入密碼"
              :disabled="isLoading"
            >
            <i 
              class="fas toggle-password"
              :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </div>

        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>

        <button type="submit" class="btn-login" :disabled="isLoading">
          <i class="fas fa-spinner fa-spin" v-if="isLoading"></i>
          <span v-else>登入</span>
        </button>
      </form>

      <router-link to="/" class="back-link">
        <i class="fas fa-arrow-left"></i> 返回前台
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/adminStore'

const router = useRouter()
const adminStore = useAdminStore()

const form = ref({
  account: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  // 驗證
  if (!form.value.account.trim()) {
    errorMessage.value = '請輸入帳號'
    return
  }
  if (!form.value.password.trim()) {
    errorMessage.value = '請輸入密碼'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const result = await adminStore.login(form.value.account, form.value.password)

  if (result.success) {
    router.push('/admin/dashboard')
  } else {
    errorMessage.value = result.message
  }

  isLoading.value = false
}
</script>
<style>
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: #ffffff;
  padding: 50px 40px;
  border-radius: 16px;
  box-shadow: 0 2px 15px #3A6B5C;
  width: 100%;
  max-width: 500px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 28px;
  color: #3A6B5C;
  margin-bottom: 10px;
}

.login-header p {
  color: #3A6B5C;
  font-size: 14px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #ffffff;
  font-size: 14px;
}


.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  color: #e0e0e0;
}

.input-wrapper > i:first-child {
  position: absolute;
  left: 15px;
  color: #95a5a6;
  font-size: 16px;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #3A6B5C;
}

.toggle-password {
  position: absolute;
  right: 15px;
  color: #95a5a6;
  cursor: pointer;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: #3A6B5C;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

.btn-login {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ffffff);
  color: #3A6B5C;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px #3A6B5C;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 30px;
  color: #3A6B5C;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
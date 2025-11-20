<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="logo">
        <h1>pureLife</h1>
      </div>

      <!-- 切換按鈕 -->
      <div class="auth-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: isLogin }"
          @click="isLogin = true"
        >
          登入
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: !isLogin }"
          @click="isLogin = false"
        >
          註冊
        </button>
      </div>

      <!-- 表單區域 -->
      <div class="auth-form">
        <!-- 登入表單 -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="form">
          <h2 class="form-title">登入您的帳戶</h2>
          <p class="form-subtitle">請輸入您的電子郵件或手機號碼以開始使用。</p>

          <div class="form-group">
            <label for="login-email">電子郵件或手機號碼</label>
            <input 
              type="text" 
              id="login-email"
              v-model="loginForm.email"
              placeholder="請輸入電子郵件或手機號碼"
              required
            />
          </div>

          <div class="form-group">
            <label for="login-password">密碼</label>
            <input 
              type="password" 
              id="login-password"
              v-model="loginForm.password"
              placeholder="請輸入密碼"
              required
            />
          </div>

          <button type="submit" class="submit-btn">立即登入</button>

          <div class="form-footer">
            <a href="#" class="link">忘記密碼？</a>
          </div>
        </form>

        <!-- 註冊表單 -->
        <form v-else @submit.prevent="handleRegister" class="form">
          <h2 class="form-title">建立新帳戶</h2>
          <p class="form-subtitle">填寫以下資訊即可開始您的健康之旅！</p>

          <div class="form-group">
            <label for="register-name">姓名</label>
            <input 
              type="text" 
              id="register-name"
              v-model="registerForm.name"
              placeholder="請輸入您的姓名"
              required
            />
          </div>

          <div class="form-group">
            <label for="register-email">電子郵件</label>
            <input 
              type="email" 
              id="register-email"
              v-model="registerForm.email"
              placeholder="請輸入電子郵件"
              required
            />
          </div>

          <div class="form-group">
            <label for="register-phone">手機號碼</label>
            <input 
              type="tel" 
              id="register-phone"
              v-model="registerForm.phone"
              placeholder="請輸入手機號碼"
              required
            />
          </div>

          <div class="form-group">
            <label for="register-password">密碼</label>
            <input 
              type="password" 
              id="register-password"
              v-model="registerForm.password"
              placeholder="請輸入密碼（至少8個字元）"
              required
              minlength="8"
            />
          </div>

          <div class="form-group">
            <label for="register-password-confirm">確認密碼</label>
            <input 
              type="password" 
              id="register-password-confirm"
              v-model="registerForm.passwordConfirm"
              placeholder="請再次輸入密碼"
              required
            />
          </div>

          <div class="checkbox-group">
            <input 
              type="checkbox" 
              id="agree-terms"
              v-model="registerForm.agreeTerms"
              required
            />
            <label for="agree-terms">
              我同意 <a href="#" class="link">服務條款</a> 和 <a href="#" class="link">隱私政策</a>
            </label>
          </div>

          <button type="submit" class="submit-btn">立即註冊</button>
        </form>
      </div>

      <!-- 為什麼選擇我們 -->
      <div class="benefits">
        <h3>為什麼選擇 pureLife？</h3>
        <div class="benefit-list">
          <div class="benefit-item">
            <span class="icon">✓</span>
            <span>專科醫師推薦保健食品</span>
          </div>
          <div class="benefit-item">
            <span class="icon">✓</span>
            <span>經過國際認證的品質保證</span>
          </div>
          <div class="benefit-item">
            <span class="icon">✓</span>
            <span>快速配送，健康宅到家</span>
          </div>
          <div class="benefit-item">
            <span class="icon">✓</span>
            <span>24小時客戶服務支援</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)

// 登入表單資料
const loginForm = ref({
  email: '',
  password: ''
})

// 註冊表單資料
const registerForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  agreeTerms: false
})

// 處理登入
const handleLogin = () => {
  // 這裡之後會串接 API
  console.log('登入資料:', loginForm.value)
  
  // 簡單驗證
  if (!loginForm.value.email || !loginForm.value.password) {
    alert('請填寫所有欄位')
    return
  }

  // 登入成功後跳轉
  alert('登入成功！')
  router.push('/')
}

// 處理註冊
const handleRegister = () => {
  // 這裡之後會串接 API
  console.log('註冊資料:', registerForm.value)

  // 簡單驗證
  if (registerForm.value.password !== registerForm.value.passwordConfirm) {
    alert('兩次輸入的密碼不一致')
    return
  }

  if (!registerForm.value.agreeTerms) {
    alert('請同意服務條款和隱私政策')
    return
  }

  // 註冊成功後跳轉
  alert('註冊成功！')
  isLogin.value = true
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e3 0%, #f0f9ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.auth-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  padding: 2.5rem;
}

/* Logo */
.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo h1 {
  font-size: 2.5rem;
  color: #327a2ea9;
  margin: 0;
  font-weight: bold;
  letter-spacing: 2px;
}

/* 切換按鈕 */
.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: white;
  color: #327a2ea9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 表單 */
.form {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.75rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
}

.form-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #327a2ea9;
  box-shadow: 0 0 0 3px rgba(50, 122, 46, 0.1);
}

.form-group input::placeholder {
  color: #999;
}

/* Checkbox */
.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.checkbox-group input[type="checkbox"] {
  margin-top: 0.25rem;
  cursor: pointer;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.checkbox-group label {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  cursor: pointer;
}

/* 提交按鈕 */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #327a2ea9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #2a6625;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 122, 46, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

/* 表單底部 */
.form-footer {
  text-align: center;
  margin-top: 1rem;
}

.link {
  color: #327a2ea9;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.link:hover {
  color: #2a6625;
  text-decoration: underline;
}

/* 優惠特點 */
.benefits {
  border-top: 1px solid #e0e0e0;
  padding-top: 2rem;
}

.benefits h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: bold;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #666;
}

.benefit-item .icon {
  width: 24px;
  height: 24px;
  background: #e8f5e3;
  color: #327a2ea9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-container {
    padding: 1.5rem;
  }

  .logo h1 {
    font-size: 2rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-subtitle {
    font-size: 0.85rem;
  }
}
</style>
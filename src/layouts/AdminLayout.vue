<template>
  <div class="admin-layout">
    <!-- 側邊欄 -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>管理後台</h2>
        <p>歡迎，{{ adminStore.admin?.name }}</p>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item" exact-active-class="active">
          <i class="fas fa-home"></i>
          <span>首頁總覽</span>
        </router-link>
        <router-link to="/admin/products" class="nav-item" active-class="active">
          <i class="fas fa-box"></i>
          <span>商品管理</span>
        </router-link>
        <router-link to="/admin/orders" class="nav-item" active-class="active">
          <i class="fas fa-receipt"></i>
          <span>訂單管理</span>
        </router-link>
        <router-link to="/admin/members" class="nav-item" active-class="active">
          <i class="fas fa-users"></i>
          <span>會員管理</span>
        </router-link>
        <router-link to="/admin/subscriptions" class="nav-item" active-class="active">
          <i class="fas fa-sync-alt"></i>
          <span>訂閱管理</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-info">
          <i class="fas fa-user-shield"></i>
          <span>{{ adminStore.admin?.name }}</span>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          登出
        </button>
      </div>
    </aside>

    <!-- 主內容區 -->
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/adminStore'

const router = useRouter()
const adminStore = useAdminStore()

const handleLogout = () => {
  if (confirm('確定要登出嗎？')) {
    adminStore.logout()
    router.push('/admin/login')
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f6fa;
}

/* 側邊欄 */
.admin-sidebar {
  width: 260px;
  background: #3A6B5C;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh; /* 滿版高度，沒有頁尾了 */
}

.sidebar-header {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 24px;
  margin-bottom: 5px;
  color: #ffffff;
}

.sidebar-header p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

/* 導航區塊 - 靠上排列 */
.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  /* 不需要 justify-content: center，預設就是靠上 */
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 25px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  border-left: 4px solid #ffffff;
}

.nav-item i {
  width: 20px;
  font-size: 16px;
  text-align: center;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto; /* 推到最下面 */
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.btn-logout {
  width: 100%;
  padding: 12px;
  background: #ffffff;
  color: #3A6B5C;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

/* 主內容區 */
.admin-main {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
}

/* 響應式 */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 70px;
  }

  .sidebar-header h2,
  .sidebar-header p,
  .nav-item span,
  .admin-info span {
    display: none;
  }

  .nav-item {
    justify-content: center;
    padding: 15px;
  }

  .admin-main {
    margin-left: 70px;
  }
}
</style>
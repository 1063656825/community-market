<template>
  <div class="product-list">
    <div class="header">
      <h2>商品列表</h2>
      <a-button type="primary" @click="$router.push('/products/create')">
        <plus-outlined />
        新增商品
      </a-button>
    </div>
    
    <div class="content">
      <a-spin :spinning="loading">
        <div class="card-list" v-if="products.length">
          <div v-for="product in products" :key="product.id" class="product-card">
            <div class="card-image">
              <img :src="product.imageUrl" :alt="product.name" @error="handleImageError">
            </div>
            <div class="card-content">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="price-info">
                <span class="discount-price">¥{{ product.discountPrice }}</span>
                <span class="original-price">¥{{ product.originalPrice }}</span>
              </div>
              <div class="valid-date">
                有效期至：{{ formatDate(product.validDate) }}
              </div>
              <div class="card-actions">
                <a-button type="link" @click="$router.push(`/products/${product.id}/edit`)">
                  <edit-outlined />
                  编辑
                </a-button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <a-empty description="暂无商品">
            <template #description>
              <span>暂无商品，点击上方按钮添加</span>
            </template>
          </a-empty>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
  validDate: string;
}

const loading = ref(false)
const products = ref<Product[]>([])

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/200x200?text=图片加载失败'
}

const loadProducts = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/t_products')
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (error) {
    message.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.product-list {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header h2 {
  margin: 0;
  font-size: 18px;
}

.content {
  margin-top: 60px; /* 为固定头部留出空间 */
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f5f5;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card-image img:hover {
  transform: scale(1.05);
}

.card-content {
  padding: 12px;
}

.product-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.discount-price {
  color: #f5222d;
  font-size: 18px;
  font-weight: bold;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 14px;
}

.valid-date {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
  margin-top: 8px;
}

.empty-state {
  padding: 32px 0;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header {
    padding: 10px 12px;
  }

  .content {
    padding: 12px;
  }

  .card-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .card-image {
    height: 180px;
  }

  .card-content {
    padding: 10px;
  }
}
</style> 
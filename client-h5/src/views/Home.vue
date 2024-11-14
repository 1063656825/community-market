<template>
  <div class="home">
    <div class="header">
      <div class="title-section">
        <div class="title-wrapper">
          <shopping-outlined class="title-icon" />
          <h1>今日特价</h1>
        </div>
        <span class="subtitle">
          <calendar-outlined class="subtitle-icon" />
          每日新鲜特惠
        </span>
      </div>
      <div class="date-picker-section">
        <a-date-picker 
          v-model:value="selectedDate" 
          @change="loadProducts"
          :disabledDate="disabledDate"
          placeholder="选择日期"
          :allowClear="false"
        />
      </div>
    </div>
    
    <div class="content">
      <a-spin :spinning="loading">
        <div class="product-list" v-if="products.length">
          <product-card
            v-for="product in products"
            :key="product.id"
            :product="product"
            @click="showProductDetail"
          />
        </div>
        <div class="empty-state" v-else>
          <a-empty description="暂无特价商品">
            <template #description>
              <span class="empty-text">当前日期暂无特价商品</span>
            </template>
          </a-empty>
        </div>
      </a-spin>
    </div>

    <!-- 商品详情弹窗 -->
    <a-modal
      v-model:visible="detailVisible"
      :footer="null"
      :closable="true"
      :maskClosable="true"
      width="90%"
      class="product-detail-modal"
    >
      <div class="product-detail" v-if="selectedProduct">
        <div class="detail-image">
          <img 
            :src="selectedProduct.imageUrl" 
            :alt="selectedProduct.name"
            @error="handleImageError"
          />
        </div>
        <div class="detail-info">
          <h2 class="detail-name">{{ selectedProduct.name }}</h2>
          <div class="detail-prices">
            <div class="price-item">
              <span class="label">特惠价</span>
              <span class="discount-price">¥{{ selectedProduct.discountPrice }}</span>
            </div>
            <div class="price-item">
              <span class="label">原价</span>
              <span class="original-price">¥{{ selectedProduct.originalPrice }}</span>
            </div>
          </div>
          <div class="detail-date">
            <span class="label">有效期至</span>
            <span>{{ dayjs(selectedProduct.validDate).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { message } from 'ant-design-vue'
import { ShoppingOutlined, CalendarOutlined } from '@ant-design/icons-vue'
import ProductCard from '../components/ProductCard.vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

interface Product {
  id: number
  name: string
  originalPrice: number
  discountPrice: number
  imageUrl: string
  validDate: string
}

const selectedDate: Ref<Dayjs> = ref(dayjs())
const products: Ref<Product[]> = ref([])
const loading: Ref<boolean> = ref(false)
const detailVisible = ref(false)
const selectedProduct: Ref<Product | null> = ref(null)

const disabledDate = (current: Dayjs): boolean => {
  return current && current < dayjs().startOf('day');
}

const showProductDetail = (product: Product) => {
  selectedProduct.value = product
  detailVisible.value = true
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/400x400?text=图片加载失败'
}

const loadProducts = async () => {
  loading.value = true
  try {
    const date = selectedDate.value.format('YYYY-MM-DD')
    const response = await fetch(`/api/t_products?date=${date}`)
    if (response.ok) {
      products.value = await response.json()
    } else {
      message.error('获取商品列表失败')
    }
  } catch (error) {
    console.error('Error:', error)
    message.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 12px;
  background-color: #f5f5f5;
  box-sizing: border-box;
  overflow: hidden;
}

.header {
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 20px;
  color: #1890ff;
}

.title-section h1 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
  font-weight: 600;
}

.subtitle {
  margin-top: 2px;
  color: #666;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.subtitle-icon {
  font-size: 12px;
  color: #1890ff;
}

.content {
  flex: 1;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow-y: auto;
  position: relative;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 12px;
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}

.empty-text {
  color: #999;
  font-size: 14px;
}

.product-detail {
  padding: 16px;
}

.detail-image {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.detail-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info {
  padding: 16px 0;
}

.detail-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px;
  line-height: 1.4;
}

.detail-prices {
  margin-bottom: 16px;
}

.price-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.label {
  color: #666;
  font-size: 14px;
  min-width: 60px;
}

.discount-price {
  color: #f5222d;
  font-size: 24px;
  font-weight: bold;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 16px;
}

.detail-date {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

:deep(.product-detail-modal .ant-modal-content) {
  padding: 12px;
  border-radius: 12px;
}

:deep(.product-detail-modal .ant-modal-close) {
  top: 8px;
  right: 8px;
}

@media (max-width: 768px) {
  .home {
    padding: 8px;
  }

  .header {
    padding: 10px 12px;
  }

  .content {
    padding: 8px;
  }

  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
  }

  .detail-name {
    font-size: 18px;
  }

  .discount-price {
    font-size: 20px;
  }

  .original-price {
    font-size: 14px;
  }
}
</style> 
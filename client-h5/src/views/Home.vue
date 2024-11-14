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
          :inputReadOnly="true"
          :bordered="false"
        >
          <template #suffixIcon>
            <calendar-outlined style="color: #1890ff" />
          </template>
        </a-date-picker>
      </div>
    </div>
    
    <div class="content">
      <a-spin :spinning="loading">
        <div class="date-section">
          <tag-outlined class="date-icon" />
          <span>{{ dayjs(selectedDate).format('YYYY年MM月DD日') }}特价商品</span>
        </div>
        <div class="product-list" v-if="products.length">
          <product-card
            v-for="product in products"
            :key="product.id"
            :product="product"
            @click="showProductDetail"
          />
        </div>
        <div class="empty-state" v-else>
          <a-empty>
            <template #description>
              <div class="empty-text">
                <inbox-outlined class="empty-icon" />
                <span>当前日期暂无特价商品</span>
              </div>
            </template>
          </a-empty>
        </div>
      </a-spin>
    </div>

    <a-modal
      v-model:visible="detailVisible"
      :footer="null"
      :closable="true"
      :maskClosable="true"
      :width="360"
      class="product-detail-modal"
      :destroyOnClose="true"
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
            <div class="price-item current-price">
              <span class="label">特惠价</span>
              <span class="price">¥{{ selectedProduct.discountPrice }}</span>
            </div>
            <div class="price-item original-price">
              <span class="label">原价</span>
              <span class="price">¥{{ selectedProduct.originalPrice }}</span>
            </div>
          </div>
          <div class="detail-date">
            <calendar-outlined class="date-icon" />
            <span>有效期至：{{ dayjs(selectedProduct.validDate).format('YYYY年MM月DD日') }}</span>
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
import { 
  ShoppingOutlined, 
  CalendarOutlined, 
  TagOutlined, 
  InboxOutlined 
} from '@ant-design/icons-vue'
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
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 24px;
  color: #1890ff;
}

.title-section h1 {
  margin: 0;
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 600;
}

.subtitle {
  margin-top: 4px;
  color: #666;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-section {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  font-size: 16px;
  font-weight: 500;
}

.date-icon {
  font-size: 18px;
}

.content {
  flex: 1;
  padding: 0 12px 12px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.empty-state {
  margin-top: 60px;
  text-align: center;
}

.empty-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #999;
}

.empty-icon {
  font-size: 16px;
  color: #1890ff;
}

.product-detail {
  padding: 0;
}

.detail-image {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  background: #f5f5f5;
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
  padding: 16px;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px;
  line-height: 1.4;
}

.detail-prices {
  margin-bottom: 16px;
}

.price-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.price-item.current-price .price {
  color: #f5222d;
  font-size: 24px;
  font-weight: bold;
}

.price-item.original-price .price {
  color: #999;
  text-decoration: line-through;
  font-size: 14px;
}

.detail-date {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

:deep(.product-detail-modal .ant-modal-content) {
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.product-detail-modal .ant-modal-close) {
  color: white;
  top: 12px;
  right: 12px;
}

@media (max-width: 768px) {
  .header {
    padding: 10px 12px;
  }

  .title-section h1 {
    font-size: 18px;
  }

  .date-section {
    padding: 12px;
    font-size: 14px;
  }

  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
  }

  .detail-name {
    font-size: 16px;
  }

  .price-item.current-price .price {
    font-size: 20px;
  }
}
</style> 
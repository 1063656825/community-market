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

const disabledDate = (current: Dayjs): boolean => {
  return current && current < dayjs().startOf('day');
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
}
</style> 
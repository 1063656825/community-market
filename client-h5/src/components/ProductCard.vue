<template>
  <div class="product-card" @click="$emit('click', product)">
    <div class="image-wrapper">
      <img 
        :src="product.imageUrl" 
        :alt="product.name" 
        class="product-image"
        @error="handleImageError"
        v-show="!imageError"
      >
      <div v-if="imageError" class="image-error">
        <picture-outlined />
        <span>图片加载失败</span>
      </div>
      <div class="discount-tag">
        <span class="discount-percent">{{ calculateDiscount }}折</span>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
      <div class="product-price">
        <span class="discount-price">¥{{ product.discountPrice }}</span>
        <span class="original-price">¥{{ product.originalPrice }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PictureOutlined } from '@ant-design/icons-vue'

interface Product {
  id: number
  name: string
  originalPrice: number
  discountPrice: number
  imageUrl: string
  validDate: string
}

const props = defineProps<{
  product: Product
}>()

defineEmits<{
  (e: 'click', product: Product): void
}>()

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}

const calculateDiscount = computed(() => {
  const discount = (props.product.discountPrice / props.product.originalPrice) * 10
  return discount.toFixed(1)
})
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:active {
  transform: scale(0.98);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f5f5f5;
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
  gap: 8px;
}

.discount-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.product-info {
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 36px;
}

.product-price {
  margin-top: auto;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.discount-price {
  color: #ff4d4f;
  font-size: 16px;
  font-weight: bold;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
}
</style> 
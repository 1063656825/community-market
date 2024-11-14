<template>
  <div class="image-upload">
    <a-upload
      v-model:fileList="fileList"
      list-type="picture-card"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :customRequest="handleUpload"
      accept="image/*"
    >
      <div v-if="!modelValue" class="upload-placeholder">
        <plus-outlined />
        <div style="margin-top: 8px">上传图片</div>
      </div>
      <div v-else class="image-preview">
        <a-spin :spinning="loading">
          <img 
            :src="modelValue" 
            @error="handleImageError"
            v-show="!imageError"
            class="preview-image"
          />
          <div v-if="imageError" class="error-placeholder">
            <picture-outlined />
            <span>图片加载失败</span>
          </div>
        </a-spin>
      </div>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined, PictureOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileList = ref<any[]>([])
const loading = ref(false)
const imageError = ref(false)

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于 2MB!')
    return false
  }
  return true
}

const handleUpload = async ({ file, onSuccess, onError }: any) => {
  try {
    loading.value = true
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      if (base64) {
        emit('update:modelValue', base64)
        onSuccess()
      } else {
        onError(new Error('图片转换失败'))
        message.error('图片转换失败')
      }
      loading.value = false
    }

    reader.onerror = () => {
      onError(new Error('图片读取失败'))
      message.error('图片读取失败')
      loading.value = false
    }

    reader.readAsDataURL(file)
  } catch (error) {
    loading.value = false
    onError(error)
    message.error('图片处理失败')
  }
}

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.image-upload {
  width: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.error-placeholder {
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

.error-placeholder :deep(svg) {
  font-size: 24px;
}

:deep(.ant-upload.ant-upload-select) {
  width: 100%;
  height: 200px;
}

:deep(.ant-upload-list-item) {
  height: 200px;
}
</style> 
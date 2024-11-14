<template>
  <div class="image-upload">
    <a-upload
      v-model:fileList="fileList"
      list-type="picture-card"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :customRequest="customUpload"
      @change="handleChange"
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
import type { UploadChangeParam } from 'ant-design-vue'
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

const customUpload = async (options: any) => {
  const { file, onSuccess, onError } = options
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    loading.value = true
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const data = await response.json()
      onSuccess(data)
    } else {
      onError()
      message.error('上传失败')
    }
  } catch (error) {
    onError()
    message.error('上传失败')
  } finally {
    loading.value = false
  }
}

const handleImageError = () => {
  imageError.value = true
}

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'done') {
    imageError.value = false
    emit('update:modelValue', info.file.response.url)
  }
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
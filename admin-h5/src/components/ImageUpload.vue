<template>
  <div class="image-upload">
    <a-upload
      v-model:fileList="fileList"
      list-type="picture-card"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <div v-if="!modelValue">
        <plus-outlined />
        <div style="margin-top: 8px">上传图片</div>
      </div>
      <img v-else :src="modelValue" style="width: 100%" />
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { UploadChangeParam } from 'ant-design-vue'
import { message } from 'ant-design-vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileList = ref<any[]>([])

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于 2MB!')
  }
  return isImage && isLt2M
}

const handleChange = async (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    return
  }
  if (info.file.status === 'done') {
    const url = info.file.response.url
    emit('update:modelValue', url)
  }
}
</script>

<style scoped>
.image-upload {
  width: 100%;
}
</style> 
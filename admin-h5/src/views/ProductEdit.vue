<template>
  <div class="product-edit">
    <div class="header">
      <h2>{{ isEdit ? '编辑商品' : '新增商品' }}</h2>
    </div>
    <a-spin :spinning="loading">
      <a-form
        :model="formState"
        @finish="handleSubmit"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item
          label="商品名称"
          name="name"
          :rules="[{ required: true, message: '请输入商品名称' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item
          label="原价"
          name="originalPrice"
          :rules="[{ required: true, message: '请输入原价' }]"
        >
          <a-input-number
            v-model:value="formState.originalPrice"
            :min="0"
            :precision="2"
            style="width: 200px"
          />
        </a-form-item>

        <a-form-item
          label="特价"
          name="discountPrice"
          :rules="[{ required: true, message: '请输入特价' }]"
        >
          <a-input-number
            v-model:value="formState.discountPrice"
            :min="0"
            :precision="2"
            style="width: 200px"
          />
        </a-form-item>

        <a-form-item
          label="有效期"
          name="validDate"
          :rules="[{ required: true, message: '请选择有效期' }]"
        >
          <a-date-picker
            v-model:value="formState.validDate"
            style="width: 200px"
          />
        </a-form-item>

        <a-form-item
          label="商品图片"
          name="imageUrl"
          :rules="[{ required: true, message: '请上传商品图片' }]"
        >
          <div class="upload-wrapper">
            <image-upload v-model="formState.imageUrl" />
            <div class="upload-tip">建议尺寸: 800x800px, 大小不超过2MB</div>
          </div>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-space>
            <a-button type="primary" html-type="submit">保存</a-button>
            <a-button @click="$router.back()">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import ImageUpload from '../components/ImageUpload.vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const isEdit = ref(!!route.params.id)
const loading = ref(false)

interface FormState {
  name: string
  originalPrice: number
  discountPrice: number
  validDate: Dayjs | null
  imageUrl: string
}

const formState = ref<FormState>({
  name: '',
  originalPrice: 0,
  discountPrice: 0,
  validDate: null,
  imageUrl: ''
})

const loadProductDetail = async (id: string) => {
  loading.value = true
  try {
    const response = await fetch(`/api/t_products/${id}`)
    if (response.ok) {
      const data = await response.json()
      formState.value = {
        name: data.name,
        originalPrice: data.originalPrice,
        discountPrice: data.discountPrice,
        validDate: dayjs(data.validDate),
        imageUrl: data.imageUrl
      }
    } else {
      message.error('加载商品信息失败')
      router.push('/products')
    }
  } catch (error) {
    console.error('Error:', error)
    message.error('加载商品信息失败')
    router.push('/products')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (values: FormState) => {
  try {
    const submitData = {
      ...values,
      validDate: values.validDate?.format('YYYY-MM-DD')
    }

    const url = isEdit.value 
      ? `/api/t_products/${route.params.id}`
      : '/api/t_products'

    const method = isEdit.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submitData)
    })

    if (response.ok) {
      message.success(isEdit.value ? '更新成功' : '保存成功')
      router.push('/products')
    } else {
      message.error(isEdit.value ? '更新失败' : '保存失败')
    }
  } catch (error) {
    console.error('Error:', error)
    message.error(isEdit.value ? '更新失败' : '保存失败')
  }
}

onMounted(() => {
  if (isEdit.value && route.params.id) {
    loadProductDetail(route.params.id as string)
  }
})
</script>

<style scoped>
.product-edit {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.header {
  margin-bottom: 24px;
}

.header h2 {
  margin: 0;
}

.upload-wrapper {
  width: 100%;
  max-width: 300px;
}

.upload-tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}
</style> 
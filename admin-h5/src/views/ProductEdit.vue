<template>
  <div class="product-edit">
    <div class="header">
      <h2>{{ isEdit ? '编辑商品' : '新增商品' }}</h2>
    </div>
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
        <image-upload v-model="formState.imageUrl" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
        <a-space>
          <a-button type="primary" html-type="submit">保存</a-button>
          <a-button @click="$router.back()">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import ImageUpload from '../components/ImageUpload.vue'
import type { Dayjs } from 'dayjs'

const router = useRouter()
const route = useRoute()
const isEdit = ref(!!route.params.id)

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

const handleSubmit = async (values: FormState) => {
  try {
    const submitData = {
      ...values,
      validDate: values.validDate?.format('YYYY-MM-DD')
    }

    const response = await fetch('/api/t_products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submitData)
    })

    if (response.ok) {
      message.success('保存成功')
      router.push('/products')
    } else {
      message.error('保存失败')
    }
  } catch (error) {
    console.error('Error:', error)
    message.error('保存失败')
  }
}
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
</style> 
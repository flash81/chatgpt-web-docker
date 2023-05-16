<script setup lang='ts'>
import { ref } from 'vue'
import {
  NButton,
  NInput,
	NInputNumber,
  NFormItem,
  NP,
  NSelect,
  NImageGroup,
  NSpace,
  NImage,
  useMessage,
} from 'naive-ui'

import { image_generations } from '@/api'
const ms = useMessage()
const loading = ref(false)
const dataSource: any = ref([])
const prompt = ref('')
const n = ref(1)
const size = ref('256x256')
const SizeOptions: { label: string; value: string }[] = [
  { label: '256x256', value: '256x256' },
  { label: '512x512', value: '512x512' },
  { label: '1024x1024', value: '1024x1024' },
]
async function generations() {
	try {
		console.log(prompt.value, n.value, size.value)
		if(prompt.value.length < 5)
		{
			ms.error('关键词:最少输入5个字以上！')
			return
		}
		loading.value = true
		const res = await image_generations(prompt.value, n.value, size.value)
		dataSource.value = res.data

		ms.success('success')
	}
	catch (error: any) {
		console.log(error)
		ms.error(error.message ?? 'error')
	}
	finally {
		loading.value = false
	}
}
</script>

<template>

      <NP depth="3" style="margin: 8px 0 0 0">
        输入关键词，生成您想要的图片如：A cute baby sea otter。
      </NP>
		<NFormItem label="关键词" path="prompt">
			<NInput v-model:value="prompt" name="prompt" type="textarea" show-count :minlength="5" placeholder="关键词 Input" />
		</NFormItem>
      <NFormItem label="生成数量" path="n">
        <NInputNumber v-model:value="n" name="n" :min="1" max="10" placeholder="最小1，最大值10" />
      </NFormItem>
      <NFormItem label="生成图片大小" path="size">
        <NSelect v-model:value="size" :options="SizeOptions" name="size" />
      </NFormItem>
      <NImageGroup>
        <NSpace>
          <NImage
            v-for="(item, index) of dataSource" :key="index"
            width="100"
            :src="item.url"
          />
        </NSpace>
      </NImageGroup>
      <NButton
        block
        type="primary"
        :disabled="false"
        :loading="loading"
        @click="generations"
      >
        生成图片
      </NButton>
</template>

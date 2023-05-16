<script setup lang='ts'>
import { ref } from 'vue'
import {
  NButton,
  NInputNumber,
  NFormItem,
  NUpload,
  NP,
  NSelect,
  NImageGroup,
  NSpace,
  NImage,
  useMessage,
} from 'naive-ui'

import type { UploadFileInfo } from 'naive-ui'
import { image_variation } from '@/api'

const ms = useMessage()
const loading = ref(false)
const dataSource: any = ref([])

const SizeOptions: { label: string; value: string }[] = [
  { label: '256x256', value: '256x256' },
  { label: '512x512', value: '512x512' },
  { label: '1024x1024', value: '1024x1024' },
]
function beforeUpload(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  if (data.file.file?.type !== 'image/png') {
    ms.error('只能上传png格式的图片文件，请重新上传')
    return false
  }
	if (data.file.file?.size > 1024*1024*4) {
		ms.error('只能上传小于4M的图片，请重新上传')
		return false
	}
  return true
}
let imgpath = ''

const n = ref(1)
const size = ref('256x256')

function handleFinish({
				file,
				event
}: {
	file: UploadFileInfo
	event?: ProgressEvent
}) {
  const response = (event?.target as XMLHttpRequest).response
  let res = JSON.parse(response)
	// if(res.status != 'Success')
	// {
	// 	ms.error(res.message)
	// 	return false
	// }
	imgpath = res.data
}

async function variation() {
  try {
    console.log(imgpath, n.value, size.value)

		if(imgpath == '')
		{
			ms.error('请上传图片')
			return false
		}
		loading.value = true
    const res = await image_variation(imgpath, n.value, size.value)
    dataSource.value = res.data

    console.log(dataSource.value)
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
        用来作为变化的基础的图像。必须是有效的PNG文件，小于4MB，并且是正方形。
      </NP>
			<NFormItem label="基础图像" path="file">
      <NUpload
        action="/api/upload"
        list-type="image-card"
        :max="1"
        name="image"
        @before-upload="beforeUpload"
        @finish="handleFinish"
      >
        <NButton>上传图片</NButton>
      </NUpload>
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
        @click="variation"
      >
        生成图片
      </NButton>
</template>

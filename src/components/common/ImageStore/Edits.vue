<script setup lang='ts'>
import { ref } from 'vue'
import {
  NButton,
	NInput,
  NInputNumber,
  NFormItem,
  NUpload,
  // NUploadDragger,
  // NIcon,
  // NText,
  NP,
  NSelect,
  NImageGroup,
  NSpace,
  NImage,
  useMessage,
} from 'naive-ui'

import type { UploadFileInfo } from 'naive-ui'
import { image_edits } from '@/api'



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
let maskpath = ''


function handleFinish({

  event,
}: {

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
function handleMaskFinish({
				event,
											}: {
	event?: ProgressEvent
}) {
	const response = (event?.target as XMLHttpRequest).response
	let res = JSON.parse(response)
	// if(res.status != 'Success')
	// {
	// 	ms.error(res.message)
	// 	return false
	// }
	maskpath = res.data
}

async function edits() {
  try {
    console.log(imgpath,maskpath,prompt.value, n.value, size.value)
		if(prompt.value.length < 5)
		{
			ms.error('关键词:最少输入5个字以上！')
			return
		}
		if(imgpath == '')
		{
			ms.error('请上传图片')
			return false
		}
    loading.value = true
    const res = await image_edits(prompt.value, imgpath, maskpath, n.value, size.value)
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
				要编辑的图像。必须是有效的PNG文件，小于4MB，并且是正方形，如果未提供遮罩，图像必须具有透明度，将用作遮罩。
      </NP>
			<NFormItem label="关键词" path="prompt">
				<NInput v-model:value="prompt" name="prompt" type="textarea" placeholder="关键词 Input" />
			</NFormItem>
			<NFormItem label="编缉的图像" path="prompt">
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
			<NFormItem label="遮挡的图像" path="mask">
				<NUpload
					action="/api/upload_mask"
					list-type="image-card"
					:max="1"
					name="mask"
					@before-upload="beforeUpload"
					@finish="handleMaskFinish"
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
        @click="edits"
      >
        生成图片
      </NButton>
</template>

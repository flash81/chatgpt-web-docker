<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NModal, NTabPane, NTabs } from 'naive-ui'
import Generations from './Generations.vue'
import Variations from './Variations.vue'
import Edits from './Edits.vue'



interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}
const props = defineProps<Props>()

const emit = defineEmits<Emit>()


const active = ref('Generations')

const showImg = computed({
  get: () => props.visible,
  set: (visible: boolean) => emit('update:visible', visible),
})

</script>

<template>
	<NModal v-model:show="showImg" :auto-focus="false" :mask-closable="false" preset="card" style="width: 95%; max-width: 640px">
		<template #header>
			<div>图片处理器</div>
		</template>
		<div>
			<NTabs v-model:value="active" type="line" animated>
				<NTabPane v-if="Generations" name="Generations" tab="Advanced">
					<template #tab>
						<SvgIcon class="text-lg" icon="ri:equalizer-line" />
						<span class="ml-2">生成图像</span>
					</template>
					<div class="min-h-[100px]">
						<Generations />
					</div>
				</NTabPane>
						<NTabPane name="Edits" tab="Edits">
							<template #tab>
								<SvgIcon class="text-lg" icon="ri:list-settings-line" />
								<span class="ml-2">编缉图像</span>
							</template>
							<Edits />
						</NTabPane>
				<NTabPane name="Variations" tab="Variations">
					<template #tab>
						<SvgIcon class="text-lg" icon="ri:file-user-line" />
						<span class="ml-2">以图生图</span>
					</template>
					<div class="min-h-[100px]">
						<Variations />
					</div>
				</NTabPane>
			</NTabs>
		</div>
	</NModal>
</template>

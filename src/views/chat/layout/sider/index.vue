<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NButton, NLayoutSider,NImage } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore, AboutStore, ImageStore } from '@/components/common'
import customer from '@/assets/customer.png'

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const show = ref(false)
const showAbout = ref(false)
const showImg = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)

function handleAdd() {
  chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            {{ $t('chat.newChatButton') }}
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
				<div class="p-4" style="text-align: center;">
					<n-image
						width="100"
						:src="customer"
					/>
					<div>微信号：beargpt</div>
				</div>
        <div class="p-4">
          <NButton block @click="show = true">
            {{ $t('store.siderButton') }}
          </NButton>
        </div>
        <div class="p-4" style="padding-top: 0px;padding-bottom: 0px;">
          <NButton block @click="showImg = true">
            {{ $t('store.imageButton') }}
          </NButton>
        </div>
				<div class="p-4">
					<NButton block @click="showAbout = true">
						{{ $t('store.aboutButton') }}
					</NButton>
				</div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <PromptStore v-model:visible="show" />
  <ImageStore v-model:visible="showImg" />
	<AboutStore v-model:visible="showAbout" />
</template>

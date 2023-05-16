<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'


const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-full dark:bg-neutral-800">
    <div class="px-4 m-auto space-y-4 text-center max-[400px]">
      <header class="space-y-2">
        <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
          测试页
        </h2>
        <p class="text-base text-center text-slate-500 dark:text-slate-500">

        </p>

      </header>
      <NButton type="primary" @click="goHome">
        Go to Home
      </NButton>
    </div>
  </div>
</template>

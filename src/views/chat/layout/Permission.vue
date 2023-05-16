<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal,NCard,NTabs,NTabPane,NForm,NFormItemRow, useMessage } from 'naive-ui'
import {fetchRegister, fetchVerify} from '@/api'
import { useAuthStore } from '@/store'


interface Props {
  visible: boolean
}

defineProps<Props>()

const authStore = useAuthStore()
const ms = useMessage()

const loading = ref(false)
const reloading = ref(false)

const email = ref('')
const password = ref('')
const re_email = ref('')
const re_password = ref('')
const re_confirm_password = ref('')

// const disabled = computed(() => !token.value.trim() || loading.value)
const disabled = computed(() => !email.value.trim() || !password.value.trim() || loading.value)
const redisabled = computed(() => !re_email.value.trim() || !re_password.value.trim() || !re_confirm_password.value.trim() || reloading.value)

async function loginSub() {
  // const token = token.value.trim()
  const user_name = email.value.trim()
  const pass_word = password.value.trim()

  if (!user_name || ! pass_word)
    return

  try {
    loading.value = true
    const secretKey = await fetchVerify(user_name,pass_word)
    authStore.setToken(secretKey.data)
    ms.success('success')
    window.location.reload()
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    authStore.removeToken()
  }
  finally {
    loading.value = false
  }
}
async function registerSub() {
	const user_name = re_email.value.trim()
	const pass_word = re_password.value.trim()
	const confirm_password = re_confirm_password.value.trim()

	if (!user_name || ! pass_word)
		return
	var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
	if(!pattern.test(user_name))
	{
		ms.error('邮箱不正确')
		return
	}
	if(pass_word.length < 6)
	{
		ms.error('密码至少6位')
		return
	}
	if(pass_word != confirm_password)
	{
		ms.error('两次输入密码不相同')
		return
	}
	try {
		loading.value = true
		let secretKey = await fetchRegister(user_name,pass_word)
		authStore.setToken(secretKey.data)
		ms.success('success')
		window.location.reload()
	}
	catch (error: any) {
		ms.error(error.message ?? 'error')
		authStore.removeToken()

	}
	finally {
		loading.value = false
	}
}


</script>

<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
				<n-card
								title="受邀用户登录"
								size="huge"
								role="dialog"
								aria-modal="true"
								>
					<n-tabs
						class="card-tabs"
						default-value="signin"
						size="large"
						animated
						style="margin: 0 -4px"
						pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
					>
						<n-tab-pane name="signin" tab="登录">
							<n-form>
								<n-form-item-row label="邮箱">
									<n-input v-model:value="email" type="text" />
								</n-form-item-row>
								<n-form-item-row  label="密码">
									<n-input v-model:value="password" type="password" />
								</n-form-item-row>
							</n-form>
							<n-button
								block
								type="primary"
								:disabled="disabled"
								:loading="loading"
								@click="loginSub"
							>
								登录
							</n-button>
							<div>加客服微信号：beargpt</div>
						</n-tab-pane>
						<n-tab-pane name="signup" tab="注册">
							<n-form>
								<n-form-item-row label="邮箱">
									<n-input v-model:value="re_email" type="text" placeholder="只能输入邮箱" />
								</n-form-item-row>
								<n-form-item-row label="密码">
									<n-input v-model:value="re_password" type="password" />
								</n-form-item-row>
								<n-form-item-row label="重复密码">
									<n-input v-model:value="re_confirm_password" type="password"  />
								</n-form-item-row>
							</n-form>
							<n-button
												block
												type="primary"
												:disabled="redisabled"
												:loading="reloading"
												@click="registerSub"
							>
								注册
							</n-button>
							<div>加客服微信号：beargpt</div>
						</n-tab-pane>
					</n-tabs>
				</n-card>
      </div>
    </div>
  </NModal>
</template>

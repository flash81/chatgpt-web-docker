import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T = any>(username: string, password: string) {
  return post<T>({
    url: '/verify',
    data: { username, password },
  })
}
export function fetchRegister<T = any>(username: string, password: string) {
	return post<T>({
		url: '/register',
		data: { username, password },
	})
}

export function image_generations<T>(prompt: string, n: number, size: string) {
	return post<T>({
		url: '/image_generations',
		data: { prompt, n, size },
	})
}
export function image_edits<T>(prompt: string, image_path: string,mask_path: string, n: number, size: string) {
	return post<T>({
		url: '/image_edits',
		data: { prompt, image_path, mask_path, n, size },
	})
}
export function image_variation<T>(image_path: string, n: number, size: string) {
  return post<T>({
    url: '/image_variation',
    data: { image_path, n, size },
  })
}


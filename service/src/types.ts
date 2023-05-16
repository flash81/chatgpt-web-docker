import type { FetchFn } from 'chatgpt'

export interface RequestProps {
  prompt: string
  options?: ChatContext
  systemMessage: string
  temperature?: number
  top_p?: number
}

export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

export interface ChatGPTUnofficialProxyAPIOptions {
  accessToken: string
  apiReverseProxyUrl?: string
  model?: string
  debug?: boolean
  headers?: Record<string, string>
  fetch?: FetchFn
}

export interface ModelConfig {
  apiModel?: ApiModel
  reverseProxy?: string
  timeoutMs?: number
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}

export interface RequestGenerations {
	prompt: string
	n: number
	size: string
}

export interface RequestEdits {
	prompt: string
	image_path: string
	mask_path: string
	n: number
	size: string
}

export interface RequestVariation {
	image_path: string
  n: number
  size: string
}

export type ApiModel = 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined

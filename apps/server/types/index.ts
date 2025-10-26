export type ChatHistory = {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export type ChatResponse = {
  id: string
  message: string
}

export type Role = 'user' | 'assistant'

export interface Message {
  id: string
  role: Role
  content: string
  timestamp: Date
}

export interface StreamEvent {
  type: 'text' | 'done' | 'error'
  text?: string
  message?: any
  error?: string
}

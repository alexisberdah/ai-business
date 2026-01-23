'use client'

import { useState, useRef, useEffect } from 'react'
import { useClaudeStream } from '@/lib/claude/use-claude-stream'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Message } from '@/types/chat'

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p className="text-xs opacity-50 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

export function ChatInterface() {
  const { messages, isStreaming, error, sendMessage, clearMessages } =
    useClaudeStream()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const message = input.trim()
    setInput('')
    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Claude Chat</h2>
          <p className="text-sm text-muted-foreground">
            Powered by Claude Sonnet 4.5
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" onClick={clearMessages}>
            Clear chat
          </Button>
        )}
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">
                  Start a conversation with Claude
                </p>
                <p className="text-sm">
                  Ask anything, and experience real-time streaming responses
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isStreaming && (
                <div className="flex justify-start mb-4">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-600 text-sm">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="min-h-[60px] resize-none"
              disabled={isStreaming}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="self-end"
            >
              {isStreaming ? 'Sending...' : 'Send'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </Card>
    </div>
  )
}

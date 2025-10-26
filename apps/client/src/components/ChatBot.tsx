import axios from 'axios'
import { useRef, useState } from 'react'
import ChatInput, { type ChatFormData } from './ChatInput'
import type { Message } from './ChatMessages'
import ChatMessages from './ChatMessages'
import TypingIndicator from './TypingIndicator'
import popSound from '@/assets/pop.mp3'
import notificationSound from '@/assets/notification.mp3'

const popAudio = new Audio(popSound)
popAudio.volume = 0.2

const notificationAudio = new Audio(notificationSound)
notificationAudio.volume = 0.2

type ChatResponse = {
  message: string
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isBotTyping, setBotTyping] = useState(false)
  const [error, setError] = useState('')
  const conversationId = useRef(crypto.randomUUID())

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      popAudio.play()
      setMessages((prev) => [...prev, { role: 'user', content: prompt }])
      setBotTyping(true)
      setError('')

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current
      })
      notificationAudio.play()
      setMessages((prev) => [...prev, { role: 'model', content: data.message }])
    } catch (error) {
      console.error(error)
      setError('Something went wrong, try again!')
    } finally {
      setBotTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  )
}

export default ChatBot

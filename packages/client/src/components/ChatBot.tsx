import axios from 'axios'
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent
} from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowUp } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import { Button } from './ui/button'

type FormData = {
  prompt: string
}

type ChatResponse = {
  message: string
}

type Message = {
  role: 'user' | 'model'
  content: string
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isBotTyping, setBotTyping] = useState(false)
  const [error, setError] = useState('')
  const lastMsgRef = useRef<HTMLDivElement | null>(null)
  const conversationId = useRef(crypto.randomUUID())
  const { register, handleSubmit, reset, formState } = useForm<FormData>()

  useEffect(() => {
    lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setMessages((prev) => [...prev, { role: 'user', content: prompt }])
      setBotTyping(true)
      setError('')

      reset({ prompt: '' })

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current
      })
      setMessages((prev) => [...prev, { role: 'model', content: data.message }])
    } catch (error) {
      console.error(error)
      setError('Something went wrong, try again!')
    } finally {
      setBotTyping(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  const onCopyMessage = (e: ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trimEnd()
    if (selection) {
      e.preventDefault()
      e.clipboardData.setData('text/plain', selection)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            onCopy={onCopyMessage}
            ref={index === messages.length - 1 ? lastMsgRef : null}
            className={`px-2 py-1 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex self-start gap-1 px-2 py-3 bg-gray-200 rounded-lg">
            <span className="w-1 h-1 rounded-full bg-gray-800 animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]" />
            <span className="w-1 h-1 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]" />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 items-end border-2 rounded-lg p-2"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 0
          })}
          autoFocus
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
        />
        <Button
          disabled={!formState.isValid}
          className="rounded-full"
          size="icon"
        >
          <FaArrowUp />
        </Button>
      </form>
    </div>
  )
}

export default ChatBot

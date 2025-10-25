import ReactMarkdown from 'react-markdown'
import { useEffect, useRef, type ClipboardEvent } from 'react'

export type Message = {
  role: 'user' | 'model'
  content: string
}

type Props = {
  messages: Message[]
}

const ChatMessages = ({ messages }: Props) => {
  const lastMsgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onCopyMessage = (e: ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trimEnd()
    if (selection) {
      e.preventDefault()
      e.clipboardData.setData('text/plain', selection)
    }
  }

  return (
    <div className="flex flex-col gap-3">
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
    </div>
  )
}

export default ChatMessages

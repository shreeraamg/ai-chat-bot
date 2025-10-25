import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { FaArrowUp } from 'react-icons/fa'
import { useRef, type KeyboardEvent } from 'react'
import axios from 'axios'

type FormData = {
  prompt: string
}

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID())
  const { register, handleSubmit, reset, formState } = useForm<FormData>()

  const onSubmit = async ({ prompt }: FormData) => {
    reset()

    const data = await axios.post('/api/chat', {
      prompt,
      conversationId: conversationId.current
    })

    console.log(data)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  return (
    <form
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 items-end border-2 rounded-md p-2"
    >
      <textarea
        {...register('prompt', {
          required: true,
          validate: (data) => data.trim().length > 0
        })}
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
  )
}

export default ChatBot

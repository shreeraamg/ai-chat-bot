import express from 'express'
import type { Request, Response } from 'express'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'
import z from 'zod'

dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' })
})

type ChatHistory = {
  role: 'user' | 'model'
  parts: { text: string }[]
}

const conversations = new Map<string, ChatHistory[]>()

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters'),
  conversationId: z.uuid()
})

app.post('/api/chat', async (req: Request, res: Response) => {
  const reqBodyValidation = chatSchema.safeParse(req.body)
  if (!reqBodyValidation.success) {
    return res.status(400).json(reqBodyValidation.error.flatten().fieldErrors)
  }

  try {
    const { prompt, conversationId } = req.body

    const conversationHistory: ChatHistory[] =
      conversations.get(conversationId) ?? []

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-lite',
      history: conversationHistory,
      config: {
        temperature: 0.2,
        maxOutputTokens: 256
      }
    })

    const response = await chat.sendMessage({
      message: prompt
    })

    const responseMsg: string | undefined = response.text
    if (!responseMsg) {
      throw new Error('Failed to generate response')
    }

    conversationHistory?.push({ role: 'user', parts: [{ text: prompt }] })
    conversationHistory?.push({
      role: 'model',
      parts: [{ text: responseMsg }]
    })
    conversations.set(conversationId, conversationHistory)

    res.json({ message: responseMsg })
  } catch (e) {
    res.status(500).json({ error: 'Failed to generate response' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

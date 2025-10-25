import express from 'express'
import type { Request, Response } from 'express'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'

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

app.post('/api/chat', async (req: Request, res: Response) => {
  const { prompt, conversationId } = req.body

  const conversationHistory: ChatHistory[] =
    conversations.get(conversationId) ?? []

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash-lite',
    history: conversationHistory,
    config: {
      temperature: 0.2,
      maxOutputTokens: 80
    }
  })

  conversationHistory?.push({ role: 'user', parts: [{ text: prompt }] })

  const response = await chat.sendMessage({
    message: prompt
  })

  conversationHistory?.push({
    role: 'model',
    parts: [{ text: response.text || 'No Response from model' }]
  })

  conversations.set(conversationId, conversationHistory)

  res.json({ message: response.text })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

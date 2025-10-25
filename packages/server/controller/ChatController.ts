import type { Request, Response } from 'express'
import ChatService from '../service/ChatService'
import z from 'zod'

class ChatController {
  private chatService = new ChatService()

  private chatSchema = z.object({
    prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (max 1000 characters'),
    conversationId: z.uuid()
  })

  async sendMessage(req: Request, res: Response) {
    const reqBodyValidation = this.chatSchema.safeParse(req.body)
    if (!reqBodyValidation.success) {
      return res.status(400).json(reqBodyValidation.error.flatten().fieldErrors)
    }

    try {
      const { prompt, conversationId } = req.body
      const { message } = await this.chatService.sendMessage(
        conversationId,
        prompt
      )

      res.json({ message })
    } catch (e) {
      res.status(500).json({ error: 'Failed to generate response' })
    }
  }
}

export default ChatController

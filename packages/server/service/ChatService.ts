import fs from 'fs'
import path from 'path'
import { GoogleGenAI } from '@google/genai'
import conversationRepository from '../repository/ConversationRepository'
import type { ChatHistory, ChatResponse } from '../types'
import template from '../prompt/chatbot.txt'

class ChatService {
  private ai: GoogleGenAI
  private instructions: string

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const parkInfo = fs.readFileSync(
      path.join(__dirname, '..', 'prompt', 'WonderWorld.md'),
      'utf-8'
    )
    this.instructions = template.replace('{{parkInfo}}', parkInfo)
  }

  sendMessage = async (
    conversationId: string,
    prompt: string
  ): Promise<ChatResponse> => {
    console.log('Req came to service')
    const conversationHistory: ChatHistory[] =
      conversationRepository.getConversationHistory(conversationId)

    const chat = this.ai.chats.create({
      model: 'gemini-2.0-flash-lite',
      history: conversationHistory,
      config: {
        temperature: 0.2,
        maxOutputTokens: 256,
        systemInstruction: this.instructions
      }
    })

    const response = await chat.sendMessage({
      message: prompt
    })

    const responseMsg: string | undefined = response.text
    if (!responseMsg) {
      throw new Error('Failed to generate response')
    }

    conversationRepository.addMessageToConversation(conversationId, {
      role: 'user',
      parts: [{ text: prompt }]
    })
    conversationRepository.addMessageToConversation(conversationId, {
      role: 'model',
      parts: [{ text: responseMsg }]
    })

    // TODO: Handle this case where id could be undefined
    return { id: response.responseId || 'To be Fixed', message: responseMsg }
  }
}

export default new ChatService()

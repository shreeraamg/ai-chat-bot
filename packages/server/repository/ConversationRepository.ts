import type { ChatHistory } from '../types'

// In memory repository with maximum of 10 chat history
class ConversationRepository {
  private static MAX_HISTORY_LENGTH = 10
  private conversations = new Map<string, ChatHistory[]>()

  getConversationHistory(conversationId: string): ChatHistory[] {
    return this.conversations.get(conversationId) ?? []
  }

  addMessageToConversation(conversationId: string, message: ChatHistory): void {
    let history = this.conversations.get(conversationId) ?? []

    if (this.conversations.size >= ConversationRepository.MAX_HISTORY_LENGTH) {
      history.shift()
    }

    history.push(message)
    this.conversations.set(conversationId, history)
  }
}

export default ConversationRepository

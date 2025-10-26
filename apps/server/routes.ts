import type { Request, Response } from 'express'
import { Router } from 'express'
import chatController from './controller/ChatController'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' })
})

router.post('/api/chat', chatController.sendMessage)

export default router

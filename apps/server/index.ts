import dotenv from 'dotenv'
import express from 'express'
import router from './routes'

dotenv.config()

const app = express()
app.use(express.json())
app.use(router)

const port = 3000

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

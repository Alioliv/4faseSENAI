import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api', routes)

// Precisa ser o último app.use — é o que captura os next(err)
// vindos de qualquer controller.
app.use(errorHandler)

export default app

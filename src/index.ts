import 'dotenv/config'
import express from 'express'
import { clerkClient, clerkMiddleware, requireAuth } from '@clerk/express'
import { join } from 'path';

const app = express()
const PORT = 3002

app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.sendFile(join(process.cwd(), 'public/index.html'));
})

// Test https://clerk.com/docs/pr/1880/references/backend/sessions/get-token#examples-with-frameworks
// Make sure to create a JWT template with `test` as name
// https://clerk.com/docs/backend-requests/making/jwt-templates
app.get('/get-token', async (req, res) => {
  const { sessionId } = req.auth

  if (!sessionId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const template = 'test'

  const token = await clerkClient.sessions.getToken(sessionId, template)

  res.json({ token })
})

// Test https://clerk.com/docs/pr/1880/users/user-impersonation#detect-impersonated-sessions-in-the-backend
// Impersonate a user. Follow the instructions here https://clerk.com/docs/users/user-impersonation
app.get('/get-impersonated-user', requireAuth(), async (req, res) => {
  const { userId, actor } = req.auth

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  res.json({ userId, actor })
})

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

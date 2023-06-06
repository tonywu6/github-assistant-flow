import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createOAuthUserAuth } from '@octokit/auth-oauth-user'

export default async function auth(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query
  if (!code) {
    return res.status(400).json({ message: 'Missing code' })
  }
  const auth = createOAuthUserAuth({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    code: code as string,
  })
  try {
    const { token } = await auth()
    return res.json({ token })
  } catch (e) {
    return res.status(401).json({ message: String(e) })
  }
}

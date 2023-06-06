import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Octokit } from 'octokit'

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
})

export default async function issues(req: VercelRequest, res: VercelResponse) {
  const issues = await octokit.rest.issues.listForRepo({
    owner: 'secretflow',
    repo: 'secretflow',
    sort: 'created',
    direction: 'desc',
    per_page: 10,
    page: 1,
  })
  return res.json(issues.data)
}

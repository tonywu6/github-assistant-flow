import useSWRImmutable from 'swr/immutable'
import { useOctokit } from './login'

import { useState } from 'react'
import styled from 'styled-components'
import { Image, Input, Button, Form } from 'antd'

function Profile() {
  const { octokit, cacheKey } = useOctokit()
  const { data } = useSWRImmutable(cacheKey('user'), () => octokit.rest.users.getAuthenticated())
  if (!data?.data.avatar_url) {
    return null
  }
  return (
    <Image
      style={{ width: '64px', height: '64px' }}
      width={64}
      height={64}
      src={`${data.data.avatar_url}&s=128`}
      alt="user profile"
      placeholder={
        <Image
          style={{ width: '64px', height: '64px' }}
          preview={false}
          width={64}
          height={64}
          alt="user profile"
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiB4PSIwIiB5PSIwIiBmaWxsPSIjZDNkM2QzIiAvPjwvc3ZnPg=="
        />
      }
    />
  )
}

function LoginButton() {
  const endpoint = new URL('https://github.com/login/oauth/authorize')
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
  })
  if (process.env.GITHUB_OAUTH_REDIRECT) {
    params.set('redirect_uri', process.env.GITHUB_OAUTH_REDIRECT)
  }
  endpoint.search = params.toString()
  const { authenticated } = useOctokit()
  if (!authenticated) {
    return <a href={endpoint.toString()}>Login with GitHub</a>
  }
  return null
}

function CommentSection() {
  const { octokit, authenticated } = useOctokit()
  const [submitted, setSubmitted] = useState<string>()

  if (!authenticated) {
    return null
  }

  return (
    <Form<{ comment?: string }>
      onFinish={({ comment }) => {
        if (!comment) {
          return
        }
        return octokit?.rest.issues
          .createComment({ owner: 'tonywu6', repo: 'github-assistant-flow', issue_number: 1, body: comment })
          .then(({ data }) => setSubmitted(data.html_url))
          .catch(console.error)
      }}
      style={{ width: '100%' }}
    >
      <Form.Item name="comment" rules={[{ required: true }]}>
        <Input.TextArea autoSize={{ minRows: 3 }} />
      </Form.Item>
      {submitted ? (
        <p>
          Thank you for participating! See your comment at <a href={submitted}>{submitted}</a>
        </p>
      ) : (
        <Button type="primary" htmlType="submit">
          Submit comment
        </Button>
      )}
    </Form>
  )
}

function App() {
  const { authenticated } = useOctokit()
  if (!authenticated) {
    return null
  }
  return (
    <>
      <Profile />
      <CommentSection />
    </>
  )
}

const Main = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 24px;
  max-width: 1024px;
`

export default function Home() {
  return (
    <Main>
      <LoginButton />
      <App />
    </Main>
  )
}

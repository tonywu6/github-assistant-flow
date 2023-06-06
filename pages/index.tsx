import useSWRImmutable from 'swr/immutable'
import { useOctokit } from './login'
import useSWRMutation from 'swr/mutation'

import styled from 'styled-components'
import { Image, Input, Button, Form, Typography } from 'antd'
import { useState } from 'react'

const HStack = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  gap: 8px;
`

function Profile() {
  const { octokit, cacheKey } = useOctokit()
  const { data } = useSWRImmutable(cacheKey('user'), () => octokit.rest.users.getAuthenticated())
  if (!data?.data.avatar_url) {
    return null
  }
  return (
    <div style={{ width: '64px', height: '64px' }}>
      <Image
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
    </div>
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
  const { octokit, cacheKey } = useOctokit()

  const { trigger, data, error } = useSWRMutation(
    cacheKey('comment'),
    (url, { arg: { comment } }: { arg: { comment: string } }) =>
      octokit?.rest.issues.createComment({
        owner: 'tonywu6',
        repo: 'github-assistant-flow',
        issue_number: 1,
        body: comment,
      })
  )

  return (
    <Form<{ comment?: string }>
      onFinish={({ comment }) => {
        if (!comment) {
          return
        }
        return trigger({ comment }).catch(console.error)
      }}
      style={{ width: '100%' }}
    >
      <Form.Item name="comment" rules={[{ required: true }]}>
        <Input.TextArea autoSize={{ minRows: 3 }} />
      </Form.Item>
      <HStack>
        {data?.data.html_url ? (
          <Typography.Paragraph>
            Thank you for participating! See your comment at <a href={data?.data.html_url}>{data?.data.html_url}</a>
          </Typography.Paragraph>
        ) : (
          <Button type="primary" htmlType="submit">
            Submit comment
          </Button>
        )}
        {error ? <Typography.Paragraph type="danger">{String(error)}</Typography.Paragraph> : null}
      </HStack>
    </Form>
  )
}

function WorkflowControl() {
  const { octokit, cacheKey } = useOctokit()
  const [clicked, setClicked] = useState(false)

  const { trigger, error } = useSWRMutation(cacheKey('workflow'), () =>
    octokit?.rest.actions.createWorkflowDispatch({
      owner: 'tonywu6',
      repo: 'github-assistant-flow',
      workflow_id: 'echo.yml',
      ref: 'main',
    })
  )

  return (
    <HStack>
      <Button
        danger
        onClick={() =>
          trigger()
            .then(() => setClicked(true))
            .catch(console.error)
        }
      >
        Trigger workflow
      </Button>
      {error ? <Typography.Paragraph type="danger">{String(error)}</Typography.Paragraph> : null}
      {clicked ? (
        <Typography.Paragraph>
          See workflow runs at{' '}
          <a href="https://github.com/tonywu6/github-assistant-flow/actions/workflows/echo.yml">
            https://github.com/tonywu6/github-assistant-flow/actions/workflows/echo.yml
          </a>
        </Typography.Paragraph>
      ) : null}
    </HStack>
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
      <WorkflowControl />
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

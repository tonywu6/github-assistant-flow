import { useRouter } from 'next/router'
import { Octokit } from 'octokit'
import { useMemo } from 'react'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

const AUTH_ENDPOINT = new URL(process.env.GITHUB_OAUTH_ENDPOINT as string)

let currentCode: string | undefined

function createRequest(code?: string): () => Promise<{ token?: string } | undefined> {
  if (!code) {
    return () => Promise.resolve(undefined)
  }
  const params = new URLSearchParams({ code })
  const endpoint = new URL(AUTH_ENDPOINT.href)
  endpoint.search = params.toString()
  return () => fetch(endpoint).then((r) => r.json())
}

export function useOctokit(code = currentCode) {
  const { data, error } = useSWRImmutable(() => code, createRequest(code as string))
  if (data?.token && code !== currentCode) {
    currentCode = code
  }
  const octokit = useMemo(() => new Octokit({ auth: data?.token }), [data?.token])
  return {
    octokit,
    error,
    authenticated: Boolean(data?.token),
    cacheKey: (key: string) => data?.token && `octokit:${data.token}:${key}`,
  }
}

export default function Login() {
  const {
    query: { code },
    replace,
  } = useRouter()
  const { authenticated } = useOctokit(code as string)
  if (authenticated) {
    replace('/')
  }
  return <div>Logging in ...</div>
}

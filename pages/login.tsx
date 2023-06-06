import { useRouter } from 'next/router'
import useSWR from 'swr'

const AUTH_ENDPOINT = new URL(process.env.GITHUB_OAUTH_ENDPOINT as string)

function createRequest(code: string) {
  const params = new URLSearchParams({ code })
  const endpoint = new URL(AUTH_ENDPOINT.href)
  endpoint.search = params.toString()
  return () => fetch(endpoint).then((r) => r.json())
}

export default function Login() {
  const {
    query: { code },
  } = useRouter()
  const { data, isLoading } = useSWR<{ token?: string }>(
    code,
    createRequest(code as string),
  )
  if (isLoading) {
    return <div>Loading...</div>
  }
  return <div>{data?.token}</div>
}

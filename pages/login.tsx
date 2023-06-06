import { useRouter } from 'next/router'
import useSWR from 'swr'

const AUTH_ENDPOINT = new URL(process.env.GITHUB_OAUTH_ENDPOINT as string)

export default function Login() {
  const {
    query: { code },
  } = useRouter()
  const params = new URLSearchParams({ code: String(code) })
  AUTH_ENDPOINT.search = params.toString()
  const { data, isLoading } = useSWR<{ token?: string }>(
    AUTH_ENDPOINT.toString(),
  )
  if (isLoading) {
    return <div>Loading...</div>
  }
  return <div>{data?.token}</div>
}

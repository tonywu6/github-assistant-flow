import useSWRImmutable from 'swr/immutable'
import { useOctokit } from './login'
import Image from 'next/image'

function Profile() {
  const { octokit, cacheKey } = useOctokit()
  const { data } = useSWRImmutable(cacheKey('user'), () => octokit.rest.users.getAuthenticated())
  if (!data?.data.avatar_url) {
    return null
  }
  return (
    <Image
      width={64}
      height={64}
      src={`${data.data.avatar_url}&s=128`}
      alt="user profile"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiB4PSIwIiB5PSIwIiBmaWxsPSIjZDNkM2QzIiAvPjwvc3ZnPg=="
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

export default function Home() {
  return (
    <main>
      <LoginButton />
      <Profile />
    </main>
  )
}

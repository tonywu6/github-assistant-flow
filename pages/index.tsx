export default function Home() {
  return (
    <main>
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`}
      >
        Login with GitHub
      </a>
    </main>
  )
}

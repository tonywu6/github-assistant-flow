/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_OAUTH_ENDPOINT: process.env.GITHUB_OAUTH_ENDPOINT,
    GITHUB_OAUTH_REDIRECT: process.env.GITHUB_OAUTH_REDIRECT,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  },
}

module.exports = nextConfig

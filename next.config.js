/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'softtennis-ace-review.com',
      'soft-tennis-ace-review-bucket2.s3.amazonaws.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_API_BASE_PATH}/:path*`  // 本番環境
          : 'http://localhost:8000/:path*'  // 開発環境
      },
    ] 
  },
} 

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
}) 

module.exports = withBundleAnalyzer(nextConfig) 

// module.exports = nextConfig 

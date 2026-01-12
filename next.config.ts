
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
    devIndicators: {
        allowedDevOrigins: [
            "https://*.cloudworkstations.dev",
        ],
    },
    // 1. Tell Next.js to run these packages on the server only (External)
    serverExternalPackages: [
        "genkit", 
        "@genkit-ai", 
        "@genkit-ai/core",
        "@genkit-ai/flow",
        "@genkit-ai/googleai",
        "@google-cloud/vertexai",
        "google-auth-library",
        "next/dist/compiled/@opentelemetry/api",
        "@opentelemetry/sdk-node",
        "@opentelemetry/sdk-trace-node",
        "@grpc/grpc-js",
        "jsonwebtoken"
    ],
    // 2. Ignore Node.js specific modules for Browser builds (Turbopack configuration)
    experimental: {
      turbo: {
        rules: {
          '*.node': {
            loaders: ['node-loader'],
            as: '*.node',
          },
          // This is the equivalent of the webpack fallback configuration
          'node-loader': {
             resolve: {
                fallback: {
                    fs: false,
                    tls: false,
                    net: false,
                    child_process: false,
                    http2: false,
                    dns: false,
                    "node:async_hooks": false,
                    async_hooks: false,
                }
             }
          }
        },
      },
    }
};
export default nextConfig;

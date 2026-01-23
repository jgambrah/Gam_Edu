
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
    // 1. Force heavy libraries to Server
    serverExternalPackages: [
        "genkit", 
        "@genkit-ai/core",
        "@genkit-ai/firebase",
        "@genkit-ai/google-genai",
        "@genkit-ai/next",
        "firebase-admin",
        "@grpc/grpc-js",
        "@opentelemetry/exporter-trace-otlp-grpc",
        "@opentelemetry/sdk-node",
        "@opentelemetry/otlp-grpc-exporter-base"
    ],

    // 2. Webpack Config (Standard Bundler)
    webpack: (config, { isServer }) => {
        if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "http2": false,
            "dns": false,
            "async_hooks": false,
            "node:async_hooks": false,
            "fs": false,
            "net": false,
            "tls": false,
            "dgram": false,
            "child_process": false,
        };
        }
        return config;
    },
};

export default nextConfig;

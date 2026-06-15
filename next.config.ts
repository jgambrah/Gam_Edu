
import type { NextConfig } from 'next';

const nextConfig: any = {
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
    experimental: {
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
        "@opentelemetry/otlp-grpc-exporter-base",
        "wav"
    ],
};

export default nextConfig;

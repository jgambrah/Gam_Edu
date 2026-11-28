
import type { NextConfig } from 'next';

const nextConfig: any = {
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    devIndicators: false,
    // Audit D-029: this used to be `hostname: '**'`, which made /_next/image an open image-processing proxy for ANY https
    // host (cost-abuse vector on Vercel). The app does not currently import next/image at all (plain <img> tags load
    // directly from these hosts), so the optimiser only needs the hosts the product legitimately uses. Add a host here
    // deliberately (with a test) before using next/image with it.
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/v0/b/**' }, // school logos, lessons, stories
            { protocol: 'https', hostname: 'storage.googleapis.com', pathname: '/**' }, // CDN bucket assets
            { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' }, // Google profile photos
            { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
            { protocol: 'https', hostname: 'img.youtube.com', pathname: '/vi/**' }, // video thumbnails
            { protocol: 'https', hostname: 'api.dicebear.com', pathname: '/**' }, // tutor avatar
        ],
    },
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

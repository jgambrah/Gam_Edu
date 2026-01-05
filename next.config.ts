
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
    serverExternalPackages: [
        "genkit", 
        "@genkit-ai", 
        "next/dist/compiled/@opentelemetry/api",
        "@opentelemetry/sdk-node",
        "@opentelemetry/sdk-trace-node",
        "@grpc/grpc-js",
        "jsonwebtoken"
    ],
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false, 
                tls: false, 
                net: false,
                child_process: false,
                http2: false,
                dns: false,
            };
        }
        return config;
    },
};
export default nextConfig;

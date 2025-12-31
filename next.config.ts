
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
    serverExternalPackages: [
        "genkit", 
        "@genkit-ai", 
        "@opentelemetry/sdk-node",
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
            };
        }
        return config;
    },
};
export default nextConfig;

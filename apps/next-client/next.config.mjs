/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const baseUrl = "https://chess.atulmorchhlay.com";
        return [
            {
                source: "/api/auth/verify",
                destination: `${baseUrl}/api/auth/verify`,
            },
            {
                source: "/api/auth/login",
                destination: `${baseUrl}/api/auth/login`,
            },
            {
                source: "/api/auth/register",
                destination: `${baseUrl}/api/auth/register`,
            },
            {
                source: "/api/game",
                destination: `${baseUrl}/api/game`,
            },
            {
                source: "/api/game/:id*",
                destination: `${baseUrl}/api/game/:id*`,
            }
        ];
    },
    env: {
        BASE_URL: process.env.BASE_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
    }
};

export default nextConfig;

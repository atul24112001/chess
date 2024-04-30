/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/auth/verify",
                destination: `${process.env.BASE_URL}/api/auth/verify`,
            },
            {
                source: "/api/auth/login",
                destination: `${process.env.BASE_URL}/api/auth/login`,
            },
            {
                source: "/api/auth/register",
                destination: `${process.env.BASE_URL}/api/auth/register`,
            },
            {
                source: "/api/game",
                destination: `${process.env.BASE_URL}/api/game`,
            },
            {
                source: "/api/game/:id*",
                destination: `${process.env.BASE_URL}/api/game/:id*`,
            }
        ];
    },
    env: {
        BASE_URL: process.env.BASE_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
    }
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        SERVER_URL: 'http://localhost:3001',
    },
    images: {
        domains: ['res.cloudinary.com'],
        remotePatterns:[
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001'
            }
            
        ]
    },
    devIndicators: {
        buildActivity: false, // Disables the building indicators
        autoPrerender: false,  // Disable Prerender warnings
    }

};

export default nextConfig;

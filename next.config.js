const dedicatedEndPoint = 'https://bashir.infura-ipfs.io';
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [dedicatedEndPoint, 'bashir.infura-ipfs.io'],
    },
    env: {
        BASE_URL: process.env.BASE_URL,
    },
};
module.exports = nextConfig;

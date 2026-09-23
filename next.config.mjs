/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  async redirects() {
    return [
      {
        source: '/cv/chukwudubem-osegbe-cv.pdf',
        destination: '/cv/General_CV_Chukwudubem_Osegbe.pdf',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;

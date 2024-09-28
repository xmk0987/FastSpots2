/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/**", // Allows all paths under the "i.scdn.co" domain.
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
        pathname: "/**", // Allows all paths under the "image-cdn-ak.spotifycdn.com" domain.
      },
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
        pathname: "/**", // Allows all paths under the "image-cdn-fa.spotifycdn.com" domain.
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co", // Add the new hostname here
        pathname: "/**", // Allows all paths under the "mosaic.scdn.co" domain.
      },
    ],
  },
};

export default nextConfig;

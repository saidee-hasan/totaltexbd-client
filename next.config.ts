import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploads are stored on our own API server (e.g. http://localhost:5000/uploads/...),
    // so allow optimizing images served from local/private hosts.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.aaryansourcing.com",
      },
      {
        protocol: "https",
        hostname: "api2.bdspec.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;

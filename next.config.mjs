/** @type {import('next').NextConfig} */

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: process.env.NODE_ENV === "development",
});

const nextConfig = {};

export default withPWA(nextConfig);

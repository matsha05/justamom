import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      {
        source: "/about-me",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/general-4",
        destination: "/speaking",
        permanent: true,
      },
      {
        source: "/contact-8",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);

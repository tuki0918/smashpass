import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./utils/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

export default withNextIntl(nextConfig);

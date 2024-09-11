import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
// Enable Strict mode when Fluent UI fix the Issue with the Menu Componet Also with dialogs
//https://github.com/microsoft/fluentui/issues/31429
const nextConfig = { reactStrictMode: false };

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

const withTM = require("next-transpile-modules")(["react-syntax-highlighter"]); // pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};
module.exports = withTM(nextConfig);

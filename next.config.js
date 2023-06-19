/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:  ["lh3.googleusercontent.com","mjidnwwljrolggmamadr.supabase.co"]
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.mp3$/,
      use:{
          loader: 'file-loader',
        },
    });
 
    return config
  },
  

}

module.exports = nextConfig

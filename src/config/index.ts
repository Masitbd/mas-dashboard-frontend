// eslint-disable-next-line import/no-anonymous-default-export
export default {
  env: process.env.NEXT_PUBLIC_ENV,
  server_url:
    process.env.NEXT_PUBLIC_ENV == "development"
      ? process.env.NEXT_PUBLIC_SERVER_DEVELOPMENT_URL
      : process.env.NEXT_PUBLIC_SERVER_PRODUCTION_URL,
};

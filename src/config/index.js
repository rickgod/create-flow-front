const config = {
  development: {
    useMock: true,
    apiBaseUrl: 'http://localhost:8080',
    mockDelay: 200
  },
  production: {
    useMock: false,
    apiBaseUrl: 'https://your-production-api.com',
    mockDelay: 0
  }
}

export default config[process.env.NODE_ENV] || config.development

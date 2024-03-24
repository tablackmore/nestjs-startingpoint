export default () => ({
  // Application configuration
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    name: process.env.APP_NAME || 'Cosafe API',
  },

  // Database configuration
  database: {
    type: process.env.DB_TYPE || 'postgres', // e.g., 'postgres', 'mongodb'
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'testdb',
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your_secret_here',
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '60s',
  },

  // Additional configuration options...
});

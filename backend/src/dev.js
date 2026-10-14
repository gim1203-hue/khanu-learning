process.env.PORT = process.env.DEV_PORT || '5000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
await import('./server.js');

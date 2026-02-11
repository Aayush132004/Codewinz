const {createClient}=require('redis') ;

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: 14138,
    }
});

redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
});

module.exports=redisClient;
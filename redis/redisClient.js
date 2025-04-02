const redis = require('redis')

const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});


(async () => {
    try { 
        redisClient.on('error', (err) => console.error('Redis client error', err))
        await redisClient.connect()
        console.log('Redis connection succesful')
    }catch(error){
        console.error('Error connecting to redis:', error)
    }
})()

module.exports = redisClient
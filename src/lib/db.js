import { createClient } from "redis";
const client = createClient({
    username: 'default',
    password: process.env.REDIS_PW,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on("error", function(error) {
    console.error(error);
});

export async function connectRedis(){
    if (!client.isOpen){
        await client.connect();
    }
    return client;
}
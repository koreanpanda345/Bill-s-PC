const {ShardingManager} = require('discord.js');
const manager = new ShardingManager('./index.js', {token : process.env.DISCORD_TOKEN});

manager.spawn();
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
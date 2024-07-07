var redis = require('redis');

var dataClient = redis.createClient({ url: process.env.REDIS_URL });
var subClient = dataClient.duplicate();

var timestamp = new Date().getTime().toString();

module.exports = {
  async connect(wss) {
    await dataClient.connect();

    dataClient.on('error', err => {
      console.error('Redis server error', err);
      process.exit(1);
    });

    timestamp = await dataClient.get('todo:timestamp').catch(err => null) || timestamp;

    await subClient.connect();

    subClient.on('error', err => {
      console.error('Redis server error', err);
      process.exit(1);
    });

    subClient.subscribe('todo:timestamp', message => {
      if (message) timestamp = message;

      for (const wsClient of wss.clients) {
        try { wsClient.send(timestamp) } catch {};
      }
    });
  },

  async publish() {
    timestamp = new Date().getTime().toString();
    await dataClient.publish('todo:timestamp', timestamp);
  },

  get timestamp() {
    return timestamp;
  }
}

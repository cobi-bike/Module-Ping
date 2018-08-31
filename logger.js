const bunyan = require('bunyan');
const gelfStream = require('gelf-stream-renewed');

const ENV = process.env.NODE_ENV || 'local';
const graylogHost = process.env.AWS_GRAYLOG_HOST;
const graylogPort = process.env.AWS_GRAYLOG_PORT;

if (ENV === 'local') {
  process.stdin.pipe(process.stdout);
}

function logger(name) {
  const stream = gelfStream.forBunyan(process.env.AWS_GRAYLOG_HOST, process.env.AWS_GRAYLOG_PORT);
  const options = {
      name,
      env: ENV,
      level: process.env.LOG_LEVEL || 'info',
      serializers: bunyan.stdSerializers,
      streams: [{
        level: 'debug',
        type: 'raw',
        stream: stream
      }]
    };

    return new bunyan.createLogger(options);
}

module.exports = logger;

const winston = require('winston');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

let logger;

if (process.env.NODE_ENV === 'production') {
  logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
      enumerateErrorFormat(),
      winston.format.splat(),
      winston.format.label(),
      winston.format.timestamp(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.label} :${info.message}`,
      ),
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
        format: winston.format.colorize({ all: true }),
      }),
      new WinstonDailyRotateFile({
        filename: './logs/prod/error/%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        level: 'error',
      }),
    ],
  });
} else if (process.env.NODE_ENV === 'stage') {
  logger = winston.createLogger({
    level: 'warn',
    format: winston.format.combine(
      enumerateErrorFormat(),
      winston.format.splat(),
      winston.format.label(),
      winston.format.timestamp(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.label} :${info.message}`,
      ),
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
        format: winston.format.colorize({ all: true }),
      }),
      new WinstonDailyRotateFile({
        filename: './logs/stage/error/%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        level: 'error',
      }),
      new WinstonDailyRotateFile({
        filename: '.logs/stage/warn/%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        level: 'warn',
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      enumerateErrorFormat(),
      winston.format.splat(),
      winston.format.label(),
      winston.format.timestamp(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.label} :${info.message}`,
      ),
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
        format: winston.format.colorize({ all: true }),
      }),
      new WinstonDailyRotateFile({
        filename: './logs/dev/error/%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        level: 'error',
      }),
      new WinstonDailyRotateFile({
        filename: './logs/dev/info/%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        level: 'info',
      }),
    ],
  });
}

module.exports = logger;

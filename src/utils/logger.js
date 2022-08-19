const winston = require('winston');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
      format: winston.format.colorize({ all: true }),
    }),
    new WinstonDailyRotateFile({
      filename: './logs/error/%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      level: 'error',
    }),
    new WinstonDailyRotateFile({
      filename: './logs/info/%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      level: 'info',
    }),
  ],
});

module.exports = logger;

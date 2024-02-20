import { createLogger, format, transports } from 'winston';

const {
  combine, simple, timestamp, printf, colorize, align,
} = format;
const { NODE_ENV, APP_NAME } = process.env;

const upperCase = format((info) => ({
  ...info,
  level: `[${info.level.toUpperCase()}]`,
}));

const productionFormat = combine(
  upperCase(),
  timestamp(),
  colorize(),
  align(),
  printf(({ level, message, timestamp: t }) => (
    `${APP_NAME} ${t} ${level} ${typeof (message) === 'object' ? 'object' : message}`
  )),
);

const devFormat = combine(
  upperCase(),
  colorize(),
  simple(),
  printf(({ level, message }) => (
    `${level} ${typeof (message) === 'object' ? 'object' : message}`
  )),
);

const logger = createLogger({
  transports: [
    new transports.Console({
      format: NODE_ENV === 'development' ? devFormat : productionFormat,
    }),
  ],
});

export default logger;

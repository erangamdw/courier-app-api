import winston, { format, transports } from "winston";

// CREATE A LOGGER USING WINSTON FOR THE ERRORS AND MESSAGES

export const UserLogger = winston.createLogger({
  transports: [
    new transports.File({
      filename: "customer.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: "customerError.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

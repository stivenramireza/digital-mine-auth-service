import { Logger, LoggerInstance, LoggerOptions, transports } from 'winston';
import { LOGGING_LEVEL_CONSOLE, LOGGING_ERROR_PATH, LOGGING_LEVEL_FILE, LOGGING_EXCEPTION_PATH } from './secrets';

export const logger: LoggerInstance = new Logger(<LoggerOptions> {
    exitOnError: false,
    transports: [
        new transports.Console({
            level: LOGGING_LEVEL_CONSOLE,
            colorize: true,
            timestamp: () => {
                return (new Date()).toISOString();
            }
        }),
        new transports.File({
            filename: LOGGING_ERROR_PATH,
            level: LOGGING_LEVEL_FILE,
            maxsize: 1024 * 1024 * 10
        })
    ],
        exceptionHandlers: [
            new transports.File({
                filename: LOGGING_EXCEPTION_PATH,
                maxsize: 1024 * 1024 * 10,
                level: LOGGING_LEVEL_FILE
            })
        ]
});
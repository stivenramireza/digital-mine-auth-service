import * as dotenv from 'dotenv';
import * as fs from 'fs';

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production';
const dev = ENVIRONMENT === 'development';

if (prod) {
    if (fs.existsSync('.env')) {
        console.info('Using production environment variables');
        dotenv.config({ path: '.env' });
    } else {
        console.error('Cannot load production .env variables');
        process.exit(1);
    }
} else if (dev) {
    if (fs.existsSync('.env.dev')) {
        console.info('Using development environment variables');
        dotenv.config({ path: '.env.dev' });
    } else {
        console.error('Cannot load development .env.dev variables');
        process.exit(1);
    }
} else {
    if (fs.existsSync(`.env.${ENVIRONMENT}`)) {
        console.info(`Using ${ENVIRONMENT} environment variables`);
        dotenv.config({ path: `.env.${ENVIRONMENT}` });
    } else {
        console.error(`Cannot load ${ENVIRONMENT} .env.${ENVIRONMENT} variables`);
        process.exit(1);
    }
}

/**
 * Listening port
 */
export const PORT = process.env.PORT;

/**
 * Database connection
 */
export const DB_NAME = process.env.DB_NAME;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = Number(process.env.DB_PORT);
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_LOGGING = process.env.DB_LOGGING === 'true';

/**
 * Winston logger
 */
export const LOGGING_ERROR_PATH = process.env.LOGGING_ERROR_PATH;
export const LOGGING_EXCEPTION_PATH = process.env.LOGGING_EXCEPTION_PATH;
export const LOGGING_LEVEL_CONSOLE = process.env.LOGGING_LEVEL_CONSOLE;
export const LOGGING_LEVEL_FILE = process.env.LOGGING_LEVEL_FILE;
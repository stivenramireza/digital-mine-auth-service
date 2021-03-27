import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from '../utils/secrets';

export const options = {
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
};
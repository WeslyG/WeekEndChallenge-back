export const configuration = {
    port: process.env.DB_PORT || 3000,
    dataBase: {
        host: process.env.DB_HOST || 'mongodb://localhost/',
        name: process.env.DB_NAME || 'ts_server_db'
    },
    secret: process.env.SECRET || 'i love my job',
    saltRounds: process.env.SALT_ROUND || 10,
    baseUsers: {
        admin: {
            name: process.env.ADMIN_NAME || 'adminName',
            login: process.env.ADMIN_LOGIN || 'admin',
            defaultPassword: process.env.ADMIN_PASSWORD || 'pass4admin'
        }
    },
    baseRoles: {
        admin:  'admin',
        user: 'user'
    }
};

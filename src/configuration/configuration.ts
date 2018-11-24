export const configuration = {
    dataBase: {
        host: 'mongodb://localhost/',
        name: 'ts_server_db'
    },
    secret: 'i love my job',
    saltRounds: 10,
    baseUsers: {
        admin: {
            name: 'admin',
            email: 'admin@admin',
            defaultPassword: 'pass4admin'
        }
    },
    baseRoles: {
        admin:  'admin',
        user: 'user'
    }
};
export const configuration = {
    dataBase: {
        host: 'mongodb://mongo/',
        name: 'ts_server_db'
    },
    secret: 'i love my job',
    saltRounds: 10,
    baseUsers: {
        admin: {
            name: 'adminName',
            login: 'admin',
            defaultPassword: 'pass4admin'
        }
    },
    baseRoles: {
        admin:  'admin',
        user: 'user'
    }
};

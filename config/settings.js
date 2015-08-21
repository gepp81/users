var settings = {
    database: {
        protocol: "mysql", // or "mysql"
        query: {
            pool: true
        },
        host: "127.0.0.1",
        database: "io",
        user: "root",
        password: "root"
    },
    bibliography: {
        path: './public/bibliografia',
        slash: '/'
    },
    tokenAuth: {
        name: "InsEcUrEtOkEn"
    }
    
};

module.exports = settings;

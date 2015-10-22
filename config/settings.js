var settings = {
    database: {
        protocol: "postgres", // or "mysql"
        query: {
            pool: true
        },
	port: 5432,
        host: "ec2-54-204-26-8.compute-1.amazonaws.com",
        database: "d4rho7ul70jpji",
        user: "movkxcqiqsbzan",
        password: "BWGz3ONKdAvseLX8ZgjeWUBQFh"
    },
    bibliography: {
        path: './public/bibliografia',
        slash: '/'
    },
    tokenAuth: {
        name: "InsEcUrEtOkEn"
    }
    
};
/*

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
        path: '/home/guillermo/Documents/prueba/gestor/bibliografia/'
    },
    tokenAuth: {
        name: "InsEcUrEtOkEn"
    }
    
};*/

module.exports = settings;

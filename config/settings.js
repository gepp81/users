var settings = {
    database: {
        protocol: "postgres", // or "mysql"
        query: {
            pool: true
        },
	port: 5432,
        host: "ec2-54-197-255-248.compute-1.amazonaws.com",
        database: "deq0ik2m5kq0ma",
        user: "cdhqpobedstuxa",
        password: " QNTGBl0NFxzit9MyTotT90fSSz"
    },
    bibliography: {
        path: '/home/guillermo/Documents/prueba/gestor/bibliografia/'
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

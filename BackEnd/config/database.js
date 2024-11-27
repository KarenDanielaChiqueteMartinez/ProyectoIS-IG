

const config = {
    user: "admin" || process.env.USER, 
    password: "root" || process.env.PASSWORD, 
    server: "localhost" || process.env.SERVER,
    database: "test" || process.env.DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

module.exports = config;
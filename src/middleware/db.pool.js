const mysql = require('mysql2/promise');
let envConfigFile = '';
switch(process.env.NODE_ENV) {
    case 'live':
        envConfigFile = __dirname + '/../config/live.config';
        break;
    case 'qc':
        envConfigFile = __dirname + '/../config/qc.config';
        break;
    case 'local':
        envConfigFile = __dirname + '/../config/local.config';
        break;
    case 'dev':
    default:
        envConfigFile = __dirname + '/../config/dev.config';
        break;
}
const envConfig = require(envConfigFile);
let myAppPool = null;
appPool = function () {

    if(!myAppPool){
        console.log("크리에이트풀")
        myAppPool = mysql.createPool({
            connectionLimit: `${envConfig.DB.APP_DB.connectionLimit}`,
            host: `${envConfig.DB.APP_DB.host}`,
            user: `${envConfig.DB.APP_DB.user}`,
            password: `${envConfig.DB.APP_DB.password}`,
            database: `${envConfig.DB.APP_DB.database}`,
            port: `${envConfig.DB.APP_DB.port}`
        });
        return myAppPool
    }else{

        return myAppPool
    }

    // return myAppPool = mysql.createPool({
    //     connectionLimit: `${envConfig.DB.APP_DB.connectionLimit}`,
    //     host: `${envConfig.DB.APP_DB.host}`,
    //     user: `${envConfig.DB.APP_DB.user}`,
    //     password: `${envConfig.DB.APP_DB.password}`,
    //     database: `${envConfig.DB.APP_DB.database}`,
    //     port: `${envConfig.DB.APP_DB.port}`
    // });
};


module.exports = {
    appPool,
};

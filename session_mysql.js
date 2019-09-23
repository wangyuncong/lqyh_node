var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
 
var options = {
    host: "39.105.148.144",
    port: 3306,
    user: "bjyyq",
    password: "yhb123456",
    database: "bjyyq",
    createDatabaseTable:false,
    useConnectionPooling: true,
    endConnectionOnClose: true
};
 
var sessionStore = new MySQLStore(options);

module.exports = {
    connection:sessionStore
}

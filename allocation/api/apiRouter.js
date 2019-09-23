const mysql = require('mysql')
//链接数据库
const pool = mysql.createPool({
    host: "39.105.148.144",
    port: 3306,
    user: "bjyyq",
    connectionLimit: 10,
    password: "yhb123456",
    database: "bjyyq"
})
let query = function (sql, values) {
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sql, values, function (err, results, fields) {
                if (err) {
                    reject(err)
                }
                resolve(results)
                connection.release();
                if (err) throw error;
            });
        });
    })
}
module.exports = query
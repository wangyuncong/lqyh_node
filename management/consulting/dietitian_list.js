const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let roleid = req.query.roleid
    let sql = `select * from user_info where roleid=${roleid}`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        returnContent.status = 'success'
        returnContent.data = result
        res.send(returnContent)
    })
}
module.exports = cateGoryList
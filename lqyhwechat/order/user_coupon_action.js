const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let ids = req.query.ids || ''
    let sql = `update user_coupon_info set status='1' where id=(${ids})`
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        returnContent.status = 'success'
        // returnContent.data = result
        res.send(returnContent)
    })
}
module.exports = cateGoryList
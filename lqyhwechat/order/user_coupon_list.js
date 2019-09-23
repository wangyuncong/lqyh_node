const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let userid = req.query.userid || ''
    let sql = `select * from coupon_info b, user_coupon_info a where a.userid='${userid}' and a.couponid=b.id and a.status=0 and a.isdelete=0 and b.isdelete=0`
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
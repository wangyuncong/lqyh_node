const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let {ordermenuid,foodmenuid} = req.query
    let sql = `select * from order_menu_detail_info where ordermenuid='${ordermenuid}' and foodmenuid='${foodmenuid}' and isdelete='0'`
    console.log(sql,'sql')
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        returnContent.data = result
        returnContent.status = 'success'
        res.send(returnContent)
    })
}
module.exports = cateGoryList
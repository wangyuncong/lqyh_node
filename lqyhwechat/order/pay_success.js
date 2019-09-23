const mysql = require('mysql')
const util = require('../../util.js');
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let orderid = req.query.orderid
    let sql = `select * from order_pay_info where isdelete='0' and orderid='${orderid}'`
    console.log(sql,'sssss')
    connection.query(sql, function (err, result,fields) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if(result.length>0){
            result[0].status == 0
            returnContent.status = 'success'
        }
        
        res.send(returnContent)
        
    })
    // closeMysql
    // util.closeMysql(connection)
}
module.exports = cateGoryList
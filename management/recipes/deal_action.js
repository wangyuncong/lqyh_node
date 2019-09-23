const mysql = require('mysql')
const sd = require('silly-datetime')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryActions = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let dealid = req.query.dealid
    let status = req.query.status
    let orderid = req.query.orderid
    let kitchenerid = req.query.kitchenerid || ''
    let dietitianid = req.query.dietitianid || ''
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
    let sql = ''
    if(status==2){
        sql = `update order_deal_info set status='${status}', kitchenerid='${kitchenerid}' where id=${dealid}`
    }else{
        sql = `update order_deal_info set status='${status}', dietitianid='${dietitianid}' where id=${dealid}`
    }
    
    connection.query(sql, function (err, result) {
        if (err) {
            return res.end('[SELECT ERROR] - ' + err.message);
        }
        if(result.message){
            let sql1 = `select * from order_deal_info where orderid=${orderid}`
            connection.query(sql1, function (err, result1) {
                if (err) {
                    return res.end('[SELECT ERROR] - ' + err.message);
                }
                returnContent.status = 'success'
                returnContent.data = result1
                res.send(returnContent)
            })
            
        }
    })
}
module.exports = cateGoryActions
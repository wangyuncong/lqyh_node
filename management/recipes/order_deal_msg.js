const mysql = require('mysql')
//链接数据库
const connection = require('../../session_mysql.js').connection
let cateGoryList = (req, res) => {
    let returnContent = {
        status: 'error',
        data: null
    }
    let orderid = req.query.orderid || ''
    let orderdate = req.query.orderdate || ''
    // console.log(userid,'sdss')
    if(orderdate!==''){
        let sql = `select * from order_deal_info where orderid='${orderid}' and orderdate='${orderdate}' and isdelete=0`
        // console.log(sql,'ppppdss')
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            if(result[0].status==2){
                returnContent.data = result
                // returnContent.data = '此订单当天菜单厨师已制作完成'
                returnContent.status = 'error'
                
            }else{
                returnContent.data = result
                returnContent.status = 'success'
                
            }
            
            res.send(returnContent)
        })
    }else{
        let sql = `select * from order_deal_info where orderid='${orderid}' and isdelete=0`
        // console.log(sql,'ppppdss')
        connection.query(sql, function (err, result) {
            if (err) {
                return res.end('[SELECT ERROR] - ' + err.message);
            }
            returnContent.data = result
            returnContent.status = 'success'
            res.send(returnContent)
        })
    }
    
}
module.exports = cateGoryList